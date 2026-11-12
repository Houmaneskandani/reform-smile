"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";
import { pricing } from "@/content";
import { formatMoney, isOfferLive } from "@/content/format";
import { trackEvent } from "@/lib/tracking";
import { useStickyBookNowVisible } from "@/components/ui/StickyBookNow";

type Message = {
  role: "assistant" | "user";
  content: string;
};

// Limits enforced by the chat API (src/app/api/chat/route.ts).
const MAX_HISTORY = 20;
const MAX_MESSAGE_CHARS = 2000;

const CONNECTION_ERROR_REPLY = `Sorry, I'm having trouble connecting. Please call us at ${SITE_CONFIG.phone} for immediate help!`;

// Prices come from content/pricing.json; "limited time offer" only while the offer is live.
const SINGLE_IMPLANT_PRICE = formatMoney(pricing.singleImplant);
const FULL_ARCH_PRICE = formatMoney(pricing.fullArchPerArch);
const OFFER_NOTE = isOfferLive(pricing.offer, new Date()) ? " (limited time offer!)" : "";

// Demo answers — used when the live AI assistant isn't configured or can't be reached.
const MOCK_RESPONSES = {
  default: `Great question! For the most accurate answer, I'd recommend a **free consultation** with our team. You can book online or call us at ${SITE_CONFIG.phone}.`,
  cost: `Great question about cost! Here are our current prices:\n\n• **Single implant:** ${SINGLE_IMPLANT_PRICE} per implant\n• **Full arch (implants or veneers):** ${FULL_ARCH_PRICE} per arch${OFFER_NOTE}\n\nThe ${FULL_ARCH_PRICE} per arch can include implants with zirconia teeth, veneers, or a combination. We also offer financing options. Would you like to book a **free consultation** for an exact treatment plan?`,
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
    "Hi there! 😊 Welcome to Reform Smile. I'm here to help answer any questions about dental implants, veneers, Snap-On Dentures, or any of our services. What would you like to know?",
  offTopic:
    "I appreciate the question! However, I'm specifically here to help with dental implant questions and Reform Smile services. 😊 Is there anything about your smile or our procedures I can help with?",
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

// Asks the chat API for a reply. Falls back to the demo answers when the AI isn't
// configured (the API answers { fallback: true }) or can't be reached at all.
async function getReply(conversation: Message[]): Promise<string> {
  const latest = conversation[conversation.length - 1].content;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversation.slice(-MAX_HISTORY).map((m) => ({
          role: m.role,
          content: m.content.slice(0, MAX_MESSAGE_CHARS),
        })),
      }),
    });
    const data: unknown = await response.json();
    const { reply, fallback } = (typeof data === "object" && data !== null ? data : {}) as {
      reply?: unknown;
      fallback?: unknown;
    };
    const replyText = typeof reply === "string" && reply.trim() ? reply : null;

    if (response.ok && replyText) return replyText;
    if (!response.ok && fallback === true) return getDemoReply(latest);
    // e.g. 429 "too many messages" — the API sends a friendly reply to show as-is.
    return replyText ?? CONNECTION_ERROR_REPLY;
  } catch {
    // Network failure or a response that isn't JSON.
    return getDemoReply(latest);
  }
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
  // On phones, sit above the sticky "Book" bar only while that bar is showing
  const stickyBarVisible = useStickyBookNowVisible();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! 😊 I'm the Reform Smile assistant. I can help with questions about dental implants, costs, procedures, or booking. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Only auto-focus on desktop — prevents keyboard pop on mobile
    if (open && window.innerWidth >= 768) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || typing) return;

    const userMsg: Message = { role: "user", content: text };
    const conversation = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    try {
      trackEvent("chat_message_sent");
    } catch {
      // Analytics must never block the chat (e.g. storage blocked in private browsing).
    }

    const reply = await getReply(conversation);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setTyping(false);
  };

  return (
    <>
      {/* Chat bubble button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => { setOpen(true); trackEvent("chat_opened"); }}
            className={`fixed ${stickyBarVisible ? "bottom-20" : "bottom-4"} md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-gold hover:bg-gold-dark text-white shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer transition-[bottom,background-color] duration-300`}
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
            className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-50 md:w-[380px] md:h-[500px] bg-white md:rounded-2xl shadow-2xl md:border md:border-gray-lighter flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-navy px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
                  <Bot size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Reform Smile AI</p>
                  <p className="text-white/50 text-[11px]">Ask me anything</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              role="log"
              aria-live="polite"
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
                      <Bot size={14} className="text-gold" />
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

              {/* Typing indicator */}
              {typing && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-gold" />
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
                  placeholder="Ask about implants, costs..."
                  className="flex-1 bg-gray-lighter rounded-full px-4 py-2.5 text-[16px] md:text-sm text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 rounded-full bg-gold hover:bg-gold-dark text-white flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
              <p className="text-[10px] text-gray-light text-center mt-2">
                AI assistant — for medical advice, please book a consultation
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
