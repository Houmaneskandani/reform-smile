"use client";

import { motion } from "framer-motion";

const badges = [
  { label: "ADA", sublabel: "Member" },
  { label: "AAID", sublabel: "Certified" },
  { label: "5-Star", sublabel: "Rated" },
  { label: "HIPAA", sublabel: "Compliant" },
  { label: "CareCredit", sublabel: "Accepted" },
];

export default function TrustLogos() {
  return (
    <section className="py-8 md:py-10 bg-white border-y border-gray-lighter">
      <div className="section-container">
        <div className="flex items-center justify-center gap-8 md:gap-14 flex-wrap">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-2 text-center"
            >
              <div className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center">
                <span className="text-navy text-[10px] font-bold leading-none">
                  {badge.label.substring(0, 3)}
                </span>
              </div>
              <div className="text-left">
                <p className="text-navy text-xs font-semibold leading-tight">{badge.label}</p>
                <p className="text-gray-light text-[10px]">{badge.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
