"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { pricing } from "@/content";
import { formatMoney, isOfferLive } from "@/content/format";

// The offer wording, price, on/off switch and end date are edited in content/pricing.json.
// Prices and offers come from the practice — don't change them without the doctor's confirmation.
const { offer } = pricing;

// The homepage is prerendered, and page.tsx leaves this section out when the offer was
// already off on the build date. After the page loads, the visitor's date is checked too,
// so an offer that ended since the last build disappears without a rebuild.
const noSubscription = () => () => {};
const isLiveToday = () => isOfferLive(offer, new Date());
const wasLiveAtBuild = () => true;

export default function LimitedOffer() {
  const live = useSyncExternalStore(noSubscription, isLiveToday, wasLiveAtBuild);
  if (!live) return null;

  return (
    <section className="py-10 md:py-14 bg-gold relative overflow-hidden">
      {/* Subtle shine effect */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse motion-reduce:animate-none" style={{ animationDuration: "3s" }} />
      </div>

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock size={18} className="text-white/80" />
            <span className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-widest">
              {offer.eyebrow}
            </span>
          </div>

          <h2 className="font-heading text-2xl md:text-4xl text-white mb-3 leading-tight">
            {offer.headline}
          </h2>

          <p className="text-white text-3xl md:text-5xl font-heading font-bold mb-4">
            {`${formatMoney(pricing.fullArchPerArch)} `}<span className="text-white/70 text-lg md:text-2xl font-normal">{offer.unitLabel}</span>
          </p>

          <p className="text-white/70 text-sm md:text-base mb-6 max-w-lg mx-auto">
            {offer.body}
          </p>

          <a
            href="/consultation"
            className="inline-flex items-center gap-2 bg-white text-navy hover:bg-white/90 font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            {offer.ctaLabel}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
