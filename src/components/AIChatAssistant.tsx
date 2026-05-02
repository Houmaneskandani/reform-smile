"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/lib/constants";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const SYSTEM_PROMPT = `You are the AI assistant for Reform Smile & Dental Implant Center, led by Dr. Ava Pournejad, DDS.

YOUR ONLY PURPOSE: Help potential patients with questions about dental implants, Dr. Ava's services, procedures, costs, booking, and oral health related to implant dentistry.

STRICT BOUNDARIES:
- You ONLY discuss topics related to Reform Smile, dental implants, Dr. Ava's services, oral health, and booking appointments.
- If someone asks about ANYTHING unrelated (politics, weather, coding, recipes, other medical topics, general knowledge, etc.), politely redirect: "I'm specifically here to help with dental implant questions and Reform Smile services. Is there anything about your smile I can help with?"
- NEVER answer off-topic questions, even if you know the answer.
- NEVER pretend to be a general AI assistant.
- NEVER diagnose conditions or give specific medical advice — always recommend a consultation.

PRACTICE INFORMATION:
- Practice: Reform Smile & Dental Implant Center
- Doctor: Dr. Ava Pournejad, DDS — specialist in full arch restorations and All-on-X procedures
- Services: All-on-X (All-on-4, All-on-6) full arch dental implants, single tooth implants, dental veneers, teeth-in-a-day, bone grafting, full mouth reconstruction
- Free consultations available — includes comprehensive exam + 3D CT scan
- Same-day smile transformations possible (Teeth-in-a-Day)
- Financing and payment plans available
- Phone: ${SITE_CONFIG.phone}
- Location: ${SITE_CONFIG.city}, ${SITE_CONFIG.state}

COST RANGES (general estimates only):
- Single implant: $3,000–$5,000
- Full arch (All-on-4/6): $15,000–$30,000
- Veneers: $1,000–$2,500 per tooth
- Bone grafting: $1,500–$3,000 (if needed)
- Always note: "Exact pricing is determined during your free consultation"

RESPONSE STYLE:
- Warm, empathetic, professional — like a helpful receptionist
- Keep responses short (2-3 sentences max)
- Always end with a next step (book consultation, call us, visit a page)
- Use the patient's concern to recommend the right service`;

// Mock responses for demo mode (no API key)
const MOCK_RESPONSES: Record<string, string> = {
  default:
    "Great question! I'd love to help. For the most accurate answer, I'd recommend scheduling a free consultation with Dr. Pournejad. Would you like me to help you book one?",
  cost: `Great question about cost! Here are general ranges:\n\n• **Single implant:** $3,000–$5,000\n• **Full arch (All-on-4/6):** $15,000–$30,000\n• **Veneers:** $1,000–$2,500 per tooth\n\nWe offer financing options to make treatment affordable. For an exact quote, Dr. Pournejad offers a **free consultation** with 3D imaging. Would you like to book one?`,
  pain: "Most patients are pleasantly surprised by how comfortable the procedure is! Dr. Pournejad uses advanced techniques and anesthesia to minimize discomfort. Many patients compare it to a simple tooth extraction. Would you like to learn more during a free consultation?",
  time: "With our Teeth-in-a-Day approach, you can walk out with a brand new smile in a single appointment! The implant placement typically takes 2-4 hours. Your final permanent prosthetic is placed after 3-6 months of healing. Want to schedule a free consultation to discuss your timeline?",
  candidate:
    "Most adults with missing or failing teeth are great candidates for dental implants! Even if you've been told you don't have enough bone, procedures like bone grafting can help. The best way to find out is a **free consultation** with Dr. Pournejad, which includes 3D imaging of your jaw. Shall I help you book one?",
  hello:
    "Hi there! 😊 Welcome to Reform Smile. I'm here to help answer any questions about dental implants, veneers, or any of our services. What would you like to know?",
};

// Dental-related keywords to detect on-topic questions
const DENTAL_KEYWORDS = [
  "tooth", "teeth", "implant", "dental", "dentist", "smile", "mouth", "jaw", "gum",
  "crown", "bridge", "denture", "veneer", "bone", "arch", "bite", "chew", "eat",
  "pain", "hurt", "cost", "price", "insurance", "finance", "appointment", "book",
  "consult", "ava", "reform", "procedure", "surgery", "extract", "missing",
  "broken", "damaged", "loose", "replace", "restore", "whitening", "cleaning",
  "xray", "scan", "ct", "3d", "candidate", "qualify", "recovery", "heal",
  "how long", "how much", "scared", "afraid", "nervous", "anxious",
  "hi", "hello", "hey", "thanks", "thank", "help", "question",
];

function isDentalRelated(message: string): boolean {
  const lower = message.toLowerCase();
  return DENTAL_KEYWORDS.some((keyword) => lower.includes(keyword)) || lower.length < 15;
}

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();

  // Check if off-topic
  if (!isDentalRelated(lower)) {
    return "I appreciate the question! However, I'm specifically here to help with dental implant questions and Reform Smile services. 😊 Is there anything about your smile or our procedures I can help with?";
  }

  if (lower.includes("cost") || lower.includes("price") || lower.includes("how much") || lower.includes("afford") || lower.includes("expensive"))
    return MOCK_RESPONSES.cost;
  if (lower.includes("pain") || lower.includes("hurt") || lower.includes("scared") || lower.includes("afraid") || lower.includes("nervous"))
    return MOCK_RESPONSES.pain;
  if (lower.includes("how long") || lower.includes("time") || lower.includes("fast") || lower.includes("quick") || lower.includes("one day"))
    return MOCK_RESPONSES.time;
  if (lower.includes("candidate") || lower.includes("qualify") || lower.includes("eligible") || lower.includes("am i"))
    return MOCK_RESPONSES.candidate;
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey"))
    return MOCK_RESPONSES.hello;
  return MOCK_RESPONSES.default;
}

export default function AIChatAssistant() {
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
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const apiKey = SITE_CONFIG.anthropicKey;

    if (apiKey) {
      // Real API call
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I'm having trouble connecting. Please call us at " + SITE_CONFIG.phone + " for immediate help!",
          },
        ]);
      }
    } else {
      // Demo mode — smart mock responses
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: getMockResponse(text) },
      ]);
    }

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
            onClick={() => setOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-gold hover:bg-gold-dark text-white shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer transition-colors"
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
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br>")
                        .replace(/• /g, "• "),
                    }}
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
                    <div className="flex gap-1.5">
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
