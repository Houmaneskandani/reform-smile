"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Smile, Monitor, HandHeart, BadgeCheck } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Same-Day Results",
    description: "Leave our office with a full set of beautiful teeth — all in a single appointment.",
  },
  {
    icon: Monitor,
    title: "3D Digital Planning",
    description: "Advanced 3D imaging for precise implant placement and predictable, outstanding results.",
  },
  {
    icon: ShieldCheck,
    title: "Proven Track Record",
    description: "Over 500 successful implant procedures. Dr. Pournejad brings the experience your smile deserves.",
  },
  {
    icon: HandHeart,
    title: "Compassionate Care",
    description: "We understand dental anxiety. Our team provides a warm, supportive environment where comfort comes first.",
  },
  {
    icon: Smile,
    title: "Natural-Looking Results",
    description: "Custom-crafted prosthetics designed to look, feel, and function like your natural teeth.",
  },
  {
    icon: BadgeCheck,
    title: "Flexible Financing",
    description: "Everyone deserves a confident smile. Ask about our financing options and payment plans.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            Why Reform Smile
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
            The Reform Smile Difference
          </h2>
          <p className="text-gray text-lg leading-relaxed">
            We combine advanced technology, proven expertise, and genuine
            compassion to deliver results that change lives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-cream flex items-center justify-center mx-auto mb-6">
                <reason.icon size={28} className="text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-lg text-navy mb-3">
                {reason.title}
              </h3>
              <p className="text-gray text-[15px] leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
