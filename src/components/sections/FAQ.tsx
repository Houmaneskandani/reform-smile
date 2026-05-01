"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How much do dental implants cost?",
    answer:
      "The cost varies depending on the type of procedure and your individual needs. During your free consultation, Dr. Pournejad will provide a detailed cost breakdown and discuss financing options. We believe everyone deserves a confident smile and work with you to find a plan that fits your budget.",
  },
  {
    question: "Does the procedure hurt?",
    answer:
      "Most patients are surprised by how comfortable the procedure is. Dr. Pournejad uses advanced techniques and anesthesia to ensure you feel minimal discomfort during treatment. Many patients describe the experience as easier than a tooth extraction. Post-procedure discomfort is typically mild and manageable with over-the-counter medication.",
  },
  {
    question: "How long do dental implants last?",
    answer:
      "With proper care, dental implants can last a lifetime. The titanium implant post fuses permanently with your jawbone through a process called osseointegration. The prosthetic teeth on top typically last 15-25 years before needing replacement, though many patients go even longer.",
  },
  {
    question: "Am I a candidate for dental implants?",
    answer:
      "Most adults with missing or failing teeth are candidates for dental implants. Even if you've been told you don't have enough bone, procedures like bone grafting can make implants possible. The best way to find out is through a free consultation with Dr. Pournejad, which includes 3D imaging of your jaw.",
  },
  {
    question: "How long does the All-on-X procedure take?",
    answer:
      "With our Teeth-in-a-Day approach, you can receive a full arch of new teeth in a single appointment. The implant placement typically takes 2-4 hours, and you leave the same day with a beautiful provisional set of teeth. Your final permanent prosthetic is placed after the implants have fully integrated, usually 3-6 months later.",
  },
  {
    question: "What is the difference between implants and dentures?",
    answer:
      "Dental implants are permanently fixed in your jaw — they don't move, slip, or require adhesives. You eat, speak, and smile with complete confidence. Dentures sit on top of your gums and can shift, cause discomfort, and limit what you can eat. Implants also preserve your jawbone, while dentures can accelerate bone loss over time.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "We work with most major dental insurance providers and will help you maximize your benefits. We also offer flexible financing options and payment plans to make treatment accessible. During your consultation, our team will review your coverage and provide a clear breakdown of costs.",
  },
];

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-b border-cream-dark"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
      >
        <span className="font-heading text-lg md:text-xl text-navy pr-8 group-hover:text-gold transition-colors">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`text-gold flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-400 ease-out ${
          open ? "max-h-[500px] pb-6" : "max-h-0"
        }`}
      >
        <p className="text-gray text-[15px] leading-relaxed pr-12">
          {answer}
        </p>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section className="py-16 md:py-36 bg-cream">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
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
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
