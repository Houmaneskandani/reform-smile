"use client";

import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  CreditCard,
  ShieldCheck,
  Star,
  type LucideIcon,
} from "lucide-react";

// Each claim must be confirmed by Dr. Ava before launch (membership/certification/compliance claims).
// Generic icons on purpose — no organization logos or trademarks.
const TRUST_BADGES: { label: string; sublabel: string; icon: LucideIcon }[] = [
  { label: "ADA", sublabel: "Member", icon: BadgeCheck },
  { label: "AAID", sublabel: "Certified", icon: Award },
  { label: "5-Star", sublabel: "Rated", icon: Star },
  { label: "HIPAA", sublabel: "Compliant", icon: ShieldCheck },
  { label: "CareCredit", sublabel: "Accepted", icon: CreditCard },
];

export default function TrustLogos() {
  return (
    <section
      aria-label="Credentials and payment options"
      className="py-8 md:py-10 bg-white border-y border-gray-lighter"
    >
      <div className="section-container">
        <ul className="flex items-center justify-center gap-x-8 gap-y-6 md:gap-x-14 flex-wrap">
          {TRUST_BADGES.map((badge, i) => (
            <motion.li
              key={badge.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center flex-shrink-0">
                <badge.icon size={18} strokeWidth={1.75} className="text-gold-ink" />
              </div>
              <div className="text-left">
                <p className="text-navy text-xs font-semibold leading-tight">{badge.label}</p>
                <p className="text-gray text-[10px]">{badge.sublabel}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
