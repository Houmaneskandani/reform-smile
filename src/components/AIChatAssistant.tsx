"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { MessageCircle, X, Send, Bot, User, Mic, CalendarCheck, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { pricing } from "@/content";
import { formatMoney, isOfferLive, telHref } from "@/content/format";
import { trackEvent } from "@/lib/tracking";
import { OPEN_CHAT_EVENT } from "@/components/ui/StickyBookNow";

type Message = {
  role: "assistant" | "user";
  content: string;
  // The server's signature of a live AI reply. Sent back with the conversation; the server
  // leaves out assistant messages without a valid one (greeting, demo answers, error notes).
  sig?: string;
};

type Reply = { text: string; sig?: string };

// Limits enforced by the chat API (src/app/api/chat/route.ts).
const MAX_HISTORY = 20;
const MAX_MESSAGE_CHARS = 2000;

// One-tap questions shown under the greeting, before the patient has typed anything.
const SUGGESTED_QUESTIONS = [
  "How much do implants cost?",
  "Am I a candidate for implants?",
  "Do you offer financing?",
  "Does the procedure hurt?",
];

const CONNECTION_ERROR_REPLY = `Sorry, I'm having trouble connecting. Please call us at ${SITE_CONFIG.phone} for immediate help!`;

// Prices come from content/pricing.json; "limited time offer" only while the offer is live.
const SINGLE_IMPLANT_PRICE = formatMoney(pricing.singleImplant);
const FULL_ARCH_PRICE = formatMoney(pricing.fullArchPerArch);
const FULL_ARCH_VENEERS_PRICE = formatMoney(pricing.fullArchVeneersPerArch);
const OFFER_NOTE = isOfferLive(pricing.offer, new Date()) ? " (limited time offer!)" : "";

// Demo answers — used when the live AI assistant isn't configured or can't be reached.
const MOCK_RESPONSES = {
  default: `Great question! For the most accurate answer, I'd recommend a **free consultation** with our team. You can book online or call us at ${SITE_CONFIG.phone}.`,
  cost: `Great question about cost! Here are our current prices:\n\n• **Single implant:** ${SINGLE_IMPLANT_PRICE} per implant\n• **Full arch implants:** ${FULL_ARCH_PRICE} per arch, with zirconia teeth${OFFER_NOTE}\n• **Full arch veneers:** ${FULL_ARCH_VENEERS_PRICE} per arch\n\nWe also offer financing options. Would you like to book a **free consultation** for a personalized quote?`,
  pain: "Most patients are pleasantly surprised by how comfortable the procedure is! Our team uses advanced techniques and anesthesia to minimize discomfort, and many patients compare it to a simple tooth extraction. Would you like to learn more during a free consultation?",
  dentures:
    "Our **Snap-On Dentures** are removable, implant-supported dentures that snap securely into place, giving you more stability, comfort, and confidence than traditional dentures. Would you like to book a **free consultation** to see if they're a good fit for you?",
  time: "With same-day full arch treatment, you can walk out with a brand-new smile in a single appointment! The implant placement typically takes 2-4 hours, and your final permanent prosthetic is placed after 3-6 months of healing. Want to schedule a free consultation to discuss your timeline?",
  candidate:
    "Most adults with missing or failing teeth are great candidates for dental implants! Even if you've been told you don't have enough bone, procedures like bone grafting can help. The best way to find out is a **free consultation** with our team, which includes 3D imaging of your jaw. Would you like to book one?",
  booking: `Wonderful! You can book your **free consultation** online in just a minute, or call us at ${SITE_CONFIG.phone} and our team will find a time that works for you.`,
  fullArch:
    "Our **Full Arch Dental Implants** use the All-on-X technique (such as All-on-4): 4-6 strategically placed implants support an entire arch of permanent, beautiful teeth. Would you like to book a **free consultation** to see if it's right for you?",
  doctor: `You can learn all about our doctor's training, credentials, and experience on our **About** page. To meet our team in person, book a **free consultation** or call us at ${SITE_CONFIG.phone}.`,
  visit: `We're located in ${SITE_CONFIG.city}, ${SITE_CONFIG.state}. Our hours:\n\n• **Monday–Friday:** ${SITE_CONFIG.hours.weekdays}\n• **Saturday:** ${SITE_CONFIG.hours.saturday}\n• **Sunday:** ${SITE_CONFIG.hours.sunday}\n\nYou'll find our address and directions on our **Contact** page, or call us at ${SITE_CONFIG.phone}.`,
  hello:
    "Hi there! 😊 Welcome to Reform Dental. I'm here to help answer any questions about dental implants, veneers, Snap-On Dentures, or any of our services. What would you like to know?",
  offTopic:
    "I appreciate the question! However, I'm specifically here to help with dental implant questions and Reform Dental services. 😊 Is there anything about your smile or our procedures I can help with?",
};

// Keywords match at the start of a word ("implant" also matches "implants"), so short
// keywords don't fire inside unrelated words ("eat" in "great", "ct" in "fact").
// A trailing \b makes a keyword whole-word only ("ava" must not match "available").
const DENTAL_KEYWORDS = [
  "tooth", "teeth", "implant", "dental", "dentist", "smile", "mouth", "jaw", "gum",
  "crown", "bridge", "denture", "overdenture", "snap", "veneer", "bone", "arch",
  "all-on", "all on", "bite", "overbite", "underbite", "chew", "eat", "root canal",
  "pain", "hurt", "cost", "pric", "insurance", "financ", "appointment", "book",
  "consult", "doctor", "dr\\b", "ava\\b", "reform", "procedure", "surgery", "extract",
  "missing", "broken", "damaged", "loose", "replace", "restor", "whitening", "cleaning",
  "xray", "x-ray", "scan", "ct", "3d", "candidate", "qualify", "recovery", "heal",
  "how long", "how much", "scared", "afraid", "nervous", "anxious",
  "hour", "open\\b", "locat", "address", "direction", "parking", "office", "availab",
  "thank", "help", "question",
];
const DENTAL_TOPIC = new RegExp(`\\b(?:${DENTAL_KEYWORDS.join("|")})`);
const GREETING = /\b(?:hi|hello|hey)\b/;

// Checked in order; the first match wins.
const MOCK_INTENTS: { pattern: RegExp; reply: string }[] = [
  // "how much time…" is a timing question, not a price question.
  { pattern: /\b(?:cost|pric|how much(?! time)|afford|expensive|financ)/, reply: MOCK_RESPONSES.cost },
  { pattern: /\b(?:pain|hurt|scared|afraid|nervous|anxious)/, reply: MOCK_RESPONSES.pain },
  { pattern: /\b(?:denture|overdenture|snap)/, reply: MOCK_RESPONSES.dentures },
  {
    pattern: /\b(?:how long|how many (?:hours|days|weeks|months)|time|fast|quick|one day|in a day|in-a-day|same day|same-day)/,
    reply: MOCK_RESPONSES.time,
  },
  { pattern: /\b(?:candidate|qualify|eligible|am i\b)/, reply: MOCK_RESPONSES.candidate },
  { pattern: /\b(?:book|appointment|schedul|yes\b|sure\b)/, reply: MOCK_RESPONSES.booking },
  { pattern: /\b(?:all-on|all on|full arch|full-arch)/, reply: MOCK_RESPONSES.fullArch },
  { pattern: /\b(?:doctor|dr\b|ava\b|dentist\b|credential)/, reply: MOCK_RESPONSES.doctor },
  { pattern: /\b(?:hours\b|open\b|locat|address|direction|parking|where are you|where is your)/, reply: MOCK_RESPONSES.visit },
  { pattern: GREETING, reply: MOCK_RESPONSES.hello },
];

function isDentalRelated(lower: string): boolean {
  return lower.length < 15 || GREETING.test(lower) || DENTAL_TOPIC.test(lower);
}

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (!isDentalRelated(lower)) return MOCK_RESPONSES.offTopic;
  return MOCK_INTENTS.find((intent) => intent.pattern.test(lower))?.reply ?? MOCK_RESPONSES.default;
}

async function getDemoReply(message: string): Promise<string> {
  // A short pause so demo answers feel like the live assistant typing.
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));
  return getMockResponse(message);
}

// Asks the chat API for a reply. The live assistant streams its answer (newline-delimited
// JSON, see src/app/api/chat/route.ts): `onText` gets the reply so far each time more arrives.
// Falls back to the demo answers when the AI isn't configured (the API answers
// { fallback: true }) or can't be reached at all. Resolves with the final reply.
async function getReply(conversation: Message[], onText: (text: string) => void): Promise<Reply> {
  const latest = conversation[conversation.length - 1].content;
  const demo = async (): Promise<Reply> => ({ text: await getDemoReply(latest) });
  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversation.slice(-MAX_HISTORY).map((m) =>
          m.role === "user"
            ? { role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }
            : { role: m.role, content: m.content, ...(m.sig ? { sig: m.sig } : {}) }
        ),
      }),
    });
  } catch {
    return demo(); // network failure
  }

  if (response.ok && response.body && response.headers.get("content-type")?.includes("ndjson")) {
    return readStream(response.body, onText);
  }

  try {
    const data: unknown = await response.json();
    const { reply, fallback } = (typeof data === "object" && data !== null ? data : {}) as {
      reply?: unknown;
      fallback?: unknown;
    };
    const replyText = typeof reply === "string" && reply.trim() ? reply : null;
    if (response.ok && replyText) return { text: replyText };
    if (!response.ok && fallback === true) return demo();
    // e.g. 429 "too many messages" — the API sends a friendly reply to show as-is.
    return { text: replyText ?? CONNECTION_ERROR_REPLY };
  } catch {
    return demo(); // a response that isn't JSON
  }
}

async function readStream(body: ReadableStream<Uint8Array>, onText: (text: string) => void): Promise<Reply> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let sig: string | undefined;
  let buffered = "";
  const apply = (line: string) => {
    if (!line.trim()) return;
    try {
      const event = JSON.parse(line) as { d?: unknown; reset?: unknown; replace?: unknown; sig?: unknown };
      if (typeof event.sig === "string") {
        sig = event.sig;
        return;
      }
      if (event.reset === true) text = "";
      if (typeof event.d === "string") text += event.d;
      if (typeof event.replace === "string") text = event.replace;
      onText(text);
    } catch {
      // Ignore a malformed line rather than breaking the whole reply.
    }
  };
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffered += decoder.decode(value, { stream: true });
      const lines = buffered.split("\n");
      buffered = lines.pop() ?? "";
      lines.forEach(apply);
    }
    apply(buffered);
  } catch {
    // The connection dropped mid-reply: keep what arrived, or show the error message.
  }
  return text.trim() ? { text, sig } : { text: CONNECTION_ERROR_REPLY };
}

// ---------------------------------------------------------------------------
// Speaking instead of typing: the browser's own speech recognition (Chrome, Edge, Safari,
// iPhone, Android). Firefox has none, so the microphone button simply doesn't appear there.
// The browser sends the recording to its maker (Google or Apple) to turn it into text; the
// privacy policy says so. TypeScript's DOM types don't include this API yet, hence the
// minimal types below.
// ---------------------------------------------------------------------------
type SpeechRecognitionResultLike = { isFinal: boolean; 0: { transcript: string } };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<SpeechRecognitionResultLike> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const subscribeNever = () => () => {};
/** True in browsers that support speech recognition (always false while prerendering). */
function useSpeechSupported(): boolean {
  return useSyncExternalStore(subscribeNever, () => getSpeechRecognition() !== null, () => false);
}

// Escape the text first so a message can never be rendered as HTML, then apply the
// light formatting replies use: **bold** and line breaks.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatMessage(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

export default function AIChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! 😊 I'm the Reform Dental assistant. I can help with questions about dental implants, costs, procedures, or booking. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  // True from sending a message until the reply has finished arriving.
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const [micNote, setMicNote] = useState("");
  const speechSupported = useSpeechSupported();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Where keyboard focus was before the chat opened, so closing the chat puts it back there.
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // On phones the chat opens from the button in the sticky "Book" bar (StickyBookNow), so
  // the floating bubble doesn't sit on top of headings and cards.
  useEffect(() => {
    const openFromBar = () => {
      setOpen(true);
      trackEvent("chat_opened");
    };
    window.addEventListener(OPEN_CHAT_EVENT, openFromBar);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, openFromBar);
  }, []);

  // Stop the microphone when the chat closes or the component goes away.
  useEffect(() => {
    if (!open) recognitionRef.current?.abort();
  }, [open]);
  useEffect(() => () => recognitionRef.current?.abort(), []);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      // The message box on desktop; on phones the window itself (focusing the box would pop
      // up the keyboard), so screen readers still start inside the chat.
      if (window.innerWidth >= 768) inputRef.current?.focus();
      else dialogRef.current?.focus();
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    // Closed: give focus back to whatever opened the chat. The floating chat button is replaced
    // while the chat is open, so fall back to the chat button that is on screen now.
    const opener = openerRef.current;
    openerRef.current = null;
    if (!opener) return;
    const target = opener.isConnected
      ? opener
      : [...document.querySelectorAll<HTMLElement>('button[aria-label="Open chat"]')].find(
          // Visible = has a box (offsetParent is always null for these fixed-position buttons).
          (button) => button.getClientRects().length > 0
        );
    target?.focus();
  }, [open]);

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
      return;
    }
    const Recognition = getSpeechRecognition();
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = true; // words appear while the patient is still speaking
    recognition.continuous = false; // stops by itself after a pause
    const before = input.trim();
    recognition.onresult = (event) => {
      let spoken = "";
      for (let i = 0; i < event.results.length; i++) spoken += event.results[i][0].transcript;
      setInput(`${before ? before + " " : ""}${spoken.trim()}`.slice(0, MAX_MESSAGE_CHARS));
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicNote("Microphone access is blocked. Allow it in your browser, or type your question.");
      } else if (event.error === "no-speech") {
        setMicNote("I didn't hear anything. Tap the microphone and try again.");
      } else if (event.error !== "aborted") {
        setMicNote("Voice input isn't working right now. Please type your question.");
      }
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      inputRef.current?.focus();
    };
    recognitionRef.current = recognition;
    setMicNote("");
    try {
      recognition.start();
      setListening(true);
      try {
        trackEvent("chat_voice_used");
      } catch {
        // Analytics must never block the chat.
      }
    } catch {
      recognitionRef.current = null;
      setMicNote("Voice input isn't working right now. Please type your question.");
    }
  };

  const sendMessage = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || typing || streaming) return;
    if (listening) recognitionRef.current?.abort();
    setMicNote("");

    const userMsg: Message = { role: "user", content: text };
    const conversation = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setStreaming(true);
    try {
      trackEvent(preset ? "chat_suggestion_used" : "chat_message_sent");
    } catch {
      // Analytics must never block the chat (e.g. storage blocked in private browsing).
    }

    // The reply bubble appears with the first words and grows as the rest arrives. It always
    // sits right after this conversation, so each update replaces it.
    const showText = (text: string, sig?: string) => {
      setTyping(false);
      setMessages((prev) => [...prev.slice(0, conversation.length), { role: "assistant", content: text, sig }]);
    };
    const reply = await getReply(conversation, (text) => {
      if (text) showText(text);
    });
    showText(reply.text, reply.sig);
    setStreaming(false);
  };

  const showSuggestions = messages.length === 1 && !typing;

  return (
    <>
      {/* Chat bubble button — tablet and desktop only (phones use the sticky bar's button) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => { setOpen(true); trackEvent("chat_opened"); }}
            className="hidden md:flex fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gold hover:bg-gold-dark text-navy-dark shadow-xl hover:shadow-2xl items-center justify-center cursor-pointer transition-colors duration-300"
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            ref={dialogRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            tabIndex={-1}
            className="focus:outline-none fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-50 md:w-[380px] md:h-[500px] bg-white md:rounded-2xl shadow-2xl md:border md:border-gray-lighter flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-navy px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
                  <Bot size={18} className="text-gold-ink" />
                </div>
                <div>
                  <p id="chat-title" className="text-white font-semibold text-sm">Reform Dental AI</p>
                  <p className="text-white/75 text-[11px]">Ask me anything</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/75 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              role="log"
              aria-live="polite"
              // Screen readers wait for the whole reply instead of reading every partial update.
              aria-busy={streaming}
              aria-label="Chat messages"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user" ? "bg-navy" : "bg-gold/15"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={14} className="text-white" />
                    ) : (
                      <Bot size={14} className="text-gold-ink" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-navy text-white rounded-tr-md"
                        : "bg-gray-lighter text-dark rounded-tl-md"
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                </div>
              ))}

              {/* One-tap questions before the patient has asked anything */}
              {showSuggestions && (
                <div className="pl-9 flex flex-wrap gap-2" aria-label="Suggested questions" role="group">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      className="rounded-full border border-navy/20 bg-white px-3 py-1.5 text-[12px] text-navy hover:bg-navy hover:text-white transition-colors cursor-pointer text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing indicator */}
              {typing && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-gold-ink" />
                  </div>
                  <div className="bg-gray-lighter px-4 py-3 rounded-2xl rounded-tl-md">
                    <span className="sr-only">The assistant is typing</span>
                    <div className="flex gap-1.5" aria-hidden="true">
                      <span className="w-2 h-2 bg-gray-light rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-light rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-light rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-lighter px-4 py-3 flex-shrink-0">
              {/* Always-visible next steps. A plain <a> for /consultation: it has its own layout,
                  and client-side navigation into it crashes (see CLAUDE.md). */}
              <div className="flex gap-2 mb-3">
                <a
                  href="/consultation"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-navy hover:bg-navy-light text-white text-[12px] font-semibold py-2 transition-colors"
                >
                  <CalendarCheck size={14} aria-hidden="true" />
                  Book free consultation
                </a>
                <a
                  href={telHref(SITE_CONFIG.phone)}
                  onClick={() => trackEvent("phone_clicked")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-navy/25 text-navy hover:bg-cream text-[12px] font-semibold px-4 py-2 transition-colors"
                  aria-label={`Call us at ${SITE_CONFIG.phone}`}
                >
                  <Phone size={14} aria-hidden="true" />
                  Call us
                </a>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_MESSAGE_CHARS}
                  aria-label="Type your message"
                  placeholder={listening ? "Listening…" : "Ask about implants, costs..."}
                  className="flex-1 bg-gray-lighter rounded-full px-4 py-2.5 text-[16px] md:text-sm text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    aria-pressed={listening}
                    aria-label={listening ? "Stop listening" : "Speak your message"}
                    title={listening ? "Stop listening" : "Speak your message"}
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      listening
                        ? "bg-red-700 text-white motion-safe:animate-pulse"
                        : "bg-gray-lighter text-navy hover:bg-cream-dark"
                    }`}
                  >
                    <Mic size={16} aria-hidden="true" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || typing || streaming}
                  className="w-10 h-10 rounded-full bg-gold hover:bg-gold-dark text-navy-dark flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
              {micNote && (
                <p role="status" className="text-[11px] text-red-700 mt-2 text-center">
                  {micNote}
                </p>
              )}
              <p className="text-[10px] text-gray text-center mt-2">
                AI assistant · Please don&rsquo;t share personal health details · For medical advice, book a consultation
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
