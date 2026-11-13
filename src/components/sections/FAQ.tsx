"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { faq } from "@/content";

// The questions and answers are edited in content/faq.json.

// The open answer's bottom padding (pb-6), added to its measured text height.
const ANSWER_PADDING_PX = 24;

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  // The answer opens to its measured height, so a long answer is never cut off, whatever its
  // length and the screen width. The closed state is plain CSS (max-h-0), as prerendered.
  const answerRef = useRef<HTMLParagraphElement>(null);
  const [answerHeight, setAnswerHeight] = useState(0);

  // While open, follow the text's height when it reflows (e.g. the phone is rotated).
  useEffect(() => {
    const answerText = answerRef.current;
    if (!open || !answerText) return;
    const observer = new ResizeObserver(() => setAnswerHeight(answerText.offsetHeight));
    observer.observe(answerText);
    return () => observer.disconnect();
  }, [open]);

  const toggle = () => {
    // Measured before opening, so the transition runs from 0 to the full height.
    if (!open) setAnswerHeight(answerRef.current?.offsetHeight ?? 0);
    setOpen(!open);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-b border-cream-dark"
    >
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
      >
        <span className="font-heading text-lg md:text-xl text-navy pr-8 group-hover:text-gold-ink transition-colors">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`text-gold-ink flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ease-out ${
          open ? "pb-6" : "max-h-0"
        }`}
        style={open ? { maxHeight: answerHeight + ANSWER_PADDING_PX } : undefined}
      >
        <p ref={answerRef} className="text-gray text-[15px] leading-relaxed pr-12">
          {answer}
        </p>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  // No questions in content/faq.json: leave the section out rather than show an empty heading.
  if (faq.items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-gold-ink font-semibold tracking-widest uppercase text-sm mb-4">
              Common Questions
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray text-lg leading-relaxed">
              Everything you need to know about dental implants and our
              procedures.
            </p>
          </motion.div>

          <div>
            {faq.items.map((item, i) => (
              <FAQItem
                key={i}
                question={item.question}
                answer={item.answer}
                index={i}
              />
            ))}
          </div>

          {/* Still have questions? */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 text-center bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-cream-dark"
          >
            <h3 className="font-heading text-2xl text-navy mb-3">
              Still Have Questions?
            </h3>
            <p className="text-gray text-[15px] mb-6">
              We&apos;re here to help. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-7 py-3 rounded-full transition-colors text-sm"
              >
                Send a Message
              </a>
              <a
                href="/consultation"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy-dark font-semibold px-7 py-3 rounded-full transition-colors text-sm"
              >
                Book Free Consultation
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
