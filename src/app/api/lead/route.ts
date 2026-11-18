import { isLeadForm } from "@/lib/leads";
import {
  buildLeadBody,
  forwardLead,
  getLeadForwardingConfig,
} from "@/lib/server/lead-forwarding";
import { createRateLimiter, getClientIp, isSameOrigin } from "@/lib/server/request-guards";

// Forwards a Contact, Book or Free Consultation form to Marketing Ava, the practice's patient
// communication system (contract: docs/WEBSITE-LEADS.md in the Marketing Ava repo). Called by
// submitForm() next to the Web3Forms email, which stays the backup: the patient sees success if
// either one confirms. Server to server, so the form ids never reach the browser.
//
// A 404 while the forward is off (see src/lib/server/lead-forwarding.ts). Only the listed
// contact and scheduling fields are forwarded, never subject, message or notes. Failures are
// logged with the form name and status code only: never a name, email, phone or other value.

export const runtime = "nodejs";

const MAX_BODY_CHARS = 10_000;
// A patient sends a form once or twice; this only stops floods (Marketing Ava has its own limits).
const isRateLimited = createRateLimiter({ max: 20, windowMs: 10 * 60 * 1000 });

function reply(status: number, ok: boolean) {
  return Response.json({ ok }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let config;
  try {
    config = getLeadForwardingConfig();
  } catch (error) {
    console.error(`[api/lead] ${error instanceof Error ? error.message : "configuration error"}`);
    return reply(500, false);
  }
  if (!config) return reply(404, false);

  if (!isSameOrigin(request)) return reply(403, false);
  if (isRateLimited(getClientIp(request))) return reply(429, false);

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return reply(413, false);
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return reply(400, false);
  }
  if (typeof payload !== "object" || payload === null) return reply(400, false);
  const { form, fields, smsConsent, source, hp } = payload as Record<string, unknown>;
  if (!isLeadForm(form) || typeof fields !== "object" || fields === null) return reply(400, false);

  // Spam honeypot (the hidden "botcheck" field): answer success and send nothing, as
  // Marketing Ava itself does for a filled "_hp".
  if (typeof hp === "string" && hp.trim()) return reply(200, true);

  const body = buildLeadBody(form, fields as Record<string, unknown>, smsConsent === true, source);
  if (!body) return reply(400, false);

  const status = await forwardLead(config, form, body);
  if (status === 201) return reply(200, true);

  console.error(
    status === 0
      ? `[api/lead] Marketing Ava did not answer the ${form} form in time.`
      : `[api/lead] Marketing Ava did not accept the ${form} form (HTTP ${status}).`
  );
  return reply(502, false);
}
