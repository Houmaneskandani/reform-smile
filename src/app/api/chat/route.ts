import Anthropic from "@anthropic-ai/sdk";
import { SERVICES, SITE_CONFIG } from "@/lib/constants";
import { faq, pricing } from "@/content";
import { formatMoney, formatPriceRange, isOfferLive } from "@/content/format";
import { createRateLimiter, getClientIp, isSameOrigin } from "@/lib/server/request-guards";

// The AI chat assistant's server side. The Anthropic key is read here, on the server only —
// it never reaches the browser. Without a key the widget falls back to its demo answers.
//
// Replies stream back as newline-delimited JSON (application/x-ndjson), one object per line:
//   {"d": "text"}       more reply text, appended to what is shown
//   {"reset": true}     a fallback model took over: throw away the text shown so far
//   {"replace": "text"} show exactly this instead (refusal, empty reply, error mid-stream)
// Errors before the reply starts (bad request, rate limit, API down) are plain JSON with a
// status code and a `reply` to show, as before.

export const runtime = "nodejs";
// Hard ceiling for one chat turn on the hosting platform (the SDK timeout below stays inside it).
export const maxDuration = 60;

// A fast, lower-cost model is plenty for front-desk questions.
const MODEL = "claude-sonnet-5-5";
const MAX_HISTORY = 20; // messages sent to the model per turn
const MAX_MESSAGE_CHARS = 2000;
const MAX_BODY_CHARS = 100_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_TRACKED_IPS = 10_000;

const SERVICE_LINES = SERVICES.map((service) => `  - ${service.title}: ${service.description}`).join("\n");

// Prices come from content/pricing.json (edited in the website editor).
const SINGLE_IMPLANT_PRICE = formatMoney(pricing.singleImplant);
const FULL_ARCH_PRICE = formatMoney(pricing.fullArchPerArch);
const FULL_ARCH_VENEERS_PRICE = formatMoney(pricing.fullArchVeneersPerArch);
const BONE_GRAFT_RANGE = formatPriceRange(pricing.boneGraftMin, pricing.boneGraftMax);
const BONE_GRAFT_LINE = BONE_GRAFT_RANGE
  ? `- Bone grafting: ${BONE_GRAFT_RANGE} (if needed)`
  : "- Bone grafting (if needed): the cost varies and is discussed during the free consultation";

// The homepage FAQ (content/faq.json, edited in the website editor), so the chat gives the
// same answers as the website.
const FAQ_LINES = faq.items.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n");

// Built per request so "limited time offer" disappears as soon as the offer ends.
function systemPrompt(now: Date): string {
  const offerNote = isOfferLive(pricing.offer, now) ? " (limited time offer)" : "";
  return `You are the AI assistant for ${SITE_CONFIG.name}.

YOUR ONLY PURPOSE: Help potential patients with questions about dental implants, our services, procedures, costs, booking, and oral health related to implant dentistry.

STRICT BOUNDARIES:
- You ONLY discuss topics related to ${SITE_CONFIG.shortName}, dental implants, our services, oral health, and booking appointments.
- If someone asks about ANYTHING unrelated (politics, weather, coding, recipes, other medical topics, general knowledge, etc.), politely redirect: "I'm specifically here to help with dental implant questions and ${SITE_CONFIG.shortName} services. Is there anything about your smile I can help with?"
- NEVER answer off-topic questions, even if you know the answer.
- NEVER pretend to be a general AI assistant.
- NEVER diagnose conditions or give specific medical advice — always recommend a consultation.
- If someone describes a medical emergency (such as severe swelling, bleeding that won't stop, or trouble breathing or swallowing), tell them to call 911 or go to the nearest emergency room.
- Don't ask for personal health details, dates of birth, or insurance numbers in this chat. For anything personal, invite them to call us or book a free consultation.

OUR DOCTOR:
- Never use the doctor's name. Say "our doctor" or "our team".
- If someone asks who the doctor is, or about their training, credentials, or experience, point them to the About page on our website.

PRACTICE INFORMATION:
- Practice: ${SITE_CONFIG.name}
- Doctor: our doctor is a DDS whose practice focuses on full arch restorations and All-on-X procedures. Never call the doctor a "specialist" or "board certified".
- Services:
${SERVICE_LINES}
- Free consultations available — includes comprehensive exam + 3D CT scan
- Same-day smile transformations possible (new teeth in a single appointment for many full arch patients)
- Financing and payment plans available
- Phone: ${SITE_CONFIG.phone}
- Location: ${SITE_CONFIG.city}, ${SITE_CONFIG.state}
- Hours: Monday–Friday ${SITE_CONFIG.hours.weekdays}, Saturday ${SITE_CONFIG.hours.saturday}, Sunday ${SITE_CONFIG.hours.sunday}

COST RANGES (general estimates only):
- Single implant: ${SINGLE_IMPLANT_PRICE} per implant
- Full arch implants: ${FULL_ARCH_PRICE} per arch, implants and zirconia teeth${offerNote}
- Full arch veneers: ${FULL_ARCH_VENEERS_PRICE} per arch
- Never quote any other "regular" or "original" price and never talk about savings: only the prices above
${BONE_GRAFT_LINE}
- Always note: "Exact pricing is determined during your free consultation"

OUR WEBSITE'S FREQUENTLY ASKED QUESTIONS (answer in line with these; where they differ from the cost list above, the cost list wins):
${FAQ_LINES}

BOOKING:
- Under the chat there are two buttons: "Book free consultation" and "Call us". When someone wants to book or seems ready, tell them to tap "Book free consultation" below, or call ${SITE_CONFIG.phone}.
- You cannot book appointments, check availability or take contact details in this chat yourself.

RESPONSE STYLE:
- Warm, empathetic, professional — like a helpful receptionist
- Keep responses short (2-3 sentences max)
- Write plain text. You may wrap a key phrase in **double asterisks** to bold it; use no other formatting — no headings, bullet lists, tables, links, or URLs.
- Always end with a next step (book consultation, call us, visit a page)
- Use the patient's concern to recommend the right service`;
}

// Friendly replies the widget shows as-is. They never name the doctor.
const REFUSAL_REPLY = `That's something our team would be happy to talk through with you personally. The best next step is to **book a free consultation** or call us at ${SITE_CONFIG.phone}.`;
const EMPTY_REPLY = `Thanks for your question! Our team can give you a personalized answer during a **free consultation** — you can book online or call us at ${SITE_CONFIG.phone}.`;
const RATE_LIMIT_REPLY = `You've sent quite a few messages in a short time. Please wait a few minutes and try again, or call us at ${SITE_CONFIG.phone} — we're happy to help.`;
const BUSY_REPLY = `I'm answering a lot of questions right now. Please try again in a minute, or call us at ${SITE_CONFIG.phone} for immediate help.`;
const BAD_REQUEST_REPLY = `Sorry, I couldn't read that message. Please try rephrasing it, or call us at ${SITE_CONFIG.phone} and our team will be glad to help.`;
const FORBIDDEN_REPLY = `Sorry, I couldn't process that request. Please call us at ${SITE_CONFIG.phone} — our team is happy to help.`;
const STREAM_CUT_NOTE = `(Sorry, my reply was cut off. Please ask again, or call us at ${SITE_CONFIG.phone}.)`;
const ERROR_REPLY = `Sorry, I'm having trouble connecting right now. Please call us at ${SITE_CONFIG.phone} for immediate help!`;

// ---------------------------------------------------------------------------
// Cross-site protection: only this site's own pages may use the endpoint.
// Another website could otherwise make its visitors' browsers send "simple" POSTs
// (text/plain, no CORS preflight) here, spending our API budget from many different IPs,
// which the per-IP limit below would not slow down.
// - Requiring application/json forces a CORS preflight for cross-site callers, and this
//   route never grants CORS, so the browser never sends the POST.
// - Browsers always send Origin (and Sec-Fetch-Site) on POST; a foreign origin is rejected.
// Clients outside a browser send no Origin and can set any header — the rate limit covers those.
// ---------------------------------------------------------------------------
function isJsonRequest(request: Request): boolean {
  const type = request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase();
  return type === "application/json";
}

function forbidden(status: 403 | 415) {
  return Response.json({ error: "Request not allowed", fallback: false, reply: FORBIDDEN_REPLY }, { status });
}

// ---------------------------------------------------------------------------
// Abuse protection: a per-IP rate limit (best-effort; see createRateLimiter).
// ---------------------------------------------------------------------------
const isRateLimited = createRateLimiter({
  max: RATE_LIMIT_MAX_REQUESTS,
  windowMs: RATE_LIMIT_WINDOW_MS,
  maxTracked: RATE_LIMIT_MAX_TRACKED_IPS,
});

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------
type ChatMessage = Anthropic.Beta.BetaMessageParam & { content: string };

function dropLeadingAssistant(messages: ChatMessage[]): ChatMessage[] {
  const firstUser = messages.findIndex((message) => message.role === "user");
  return firstUser === -1 ? [] : messages.slice(firstUser);
}

/** Returns the conversation to send to the model, or null if the request body is invalid. */
function parseConversation(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw)) return null;

  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > MAX_MESSAGE_CHARS) return null;
    messages.push({ role, content: text });
  }

  // The widget's greeting is an assistant message — the model's conversation must start
  // with the patient. Trim to the most recent messages, then re-check the first one.
  const conversation = dropLeadingAssistant(dropLeadingAssistant(messages).slice(-MAX_HISTORY));
  if (conversation.length === 0) return null;
  if (conversation[conversation.length - 1].role !== "user") return null;
  return conversation;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
let client: Anthropic | undefined;

function getClient(apiKey: string): Anthropic {
  client ??= new Anthropic({ apiKey, timeout: 25_000, maxRetries: 1 });
  return client;
}

function badRequest() {
  return Response.json(
    { error: "Invalid conversation", fallback: false, reply: BAD_REQUEST_REPLY },
    { status: 400 },
  );
}

/** Turns the model's stream of events into the widget's NDJSON lines (see the top of this file). */
function streamReply(events: AsyncIterable<Anthropic.Beta.BetaRawMessageStreamEvent>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const send = (line: object) => controller.enqueue(encoder.encode(JSON.stringify(line) + "\n"));
      let text = "";
      try {
        for await (const event of events) {
          if (event.type === "content_block_start" && event.content_block.type === "fallback") {
            // The model before this point declined; its partial text must not be shown.
            text = "";
            send({ reset: true });
          } else if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            text += event.delta.text;
            send({ d: event.delta.text });
          } else if (event.type === "message_delta" && event.delta.stop_reason === "refusal") {
            send({ replace: REFUSAL_REPLY });
            text = REFUSAL_REPLY;
          }
        }
        // A reply cut off at max_tokens keeps whatever was written; an empty one gets a next step.
        if (!text.trim()) send({ replace: EMPTY_REPLY });
      } catch (error) {
        // The connection to the model broke mid-reply. Log on the server only.
        const id = error instanceof Anthropic.APIError ? error.requestID : undefined;
        console.error("[api/chat] Stream interrupted:", error instanceof Error ? error.message : error, id);
        send({ replace: text.trim() ? `${text.trim()}\n\n${STREAM_CUT_NOTE}` : ERROR_REPLY });
      } finally {
        controller.close();
      }
    },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Not configured: the widget answers with its built-in demo responses.
    return Response.json({ fallback: true }, { status: 503 });
  }

  // Checked before the rate limit, so other sites can't use up a visitor's allowance either.
  if (!isSameOrigin(request)) return forbidden(403);
  if (!isJsonRequest(request)) return forbidden(415);

  if (isRateLimited(getClientIp(request), Date.now())) {
    return Response.json(
      { error: "Too many messages", fallback: false, reply: RATE_LIMIT_REPLY },
      { status: 429, headers: { "Retry-After": String(RATE_LIMIT_WINDOW_MS / 1000) } },
    );
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) return badRequest();
    body = JSON.parse(raw);
  } catch {
    return badRequest();
  }

  const messages = parseConversation(body);
  if (!messages) return badRequest();

  try {
    // With stream: true, the request itself still fails (and lands in the catch below) on an
    // HTTP error, so errors before the reply starts keep their status codes.
    const events = await getClient(apiKey).beta.messages.create({
      model: MODEL,
      max_tokens: 4096,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: systemPrompt(new Date()),
      messages,
      stream: true,
    });
    return new Response(streamReply(events), {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    // Log details on the server only — the client gets a generic message.
    if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
      console.error("[api/chat] Anthropic rejected the API key:", error.status, error.requestID);
      return Response.json({ fallback: true }, { status: 503 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      console.error("[api/chat] Anthropic rate limit reached:", error.requestID);
      return Response.json(
        { error: "Assistant is busy", fallback: false, reply: BUSY_REPLY },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      console.error("[api/chat] Anthropic API error:", error.status, error.message, error.requestID);
      return Response.json(
        { error: "Assistant unavailable", fallback: false, reply: ERROR_REPLY },
        { status: 502 },
      );
    }
    console.error("[api/chat] Unexpected error:", error);
    return Response.json(
      { error: "Something went wrong", fallback: false, reply: ERROR_REPLY },
      { status: 500 },
    );
  }
}
