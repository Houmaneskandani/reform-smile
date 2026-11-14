"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { pricing } from "@/content";
import { formatMoney, isOfferLive } from "@/content/format";

// The offer wording, price, on/off switch and end date are edited in content/pricing.json.
// Prices and offers come from the practice — don't change them without the doctor's confirmation.
const { offer } = pricing;

/** "2026-12-31" → "December 31, 2026" (the date itself, with no time zone shift). */
function formatOfferEnd(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

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
      {/* Subtle, still shine (an endless pulse here would be moving content with no way to stop it). */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* The highlighted label. Deliberately no countdown and no "save $…" claim: see the
              crossed-out price note in the website editor (California B&P §17501, §651). */}
          <p className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-navy-dark px-4 py-1.5 text-white text-xs md:text-sm font-semibold uppercase tracking-widest shadow-md">
              <Clock size={16} aria-hidden="true" />
              {offer.eyebrow}
            </span>
          </p>

          <h2 className="font-heading text-2xl md:text-4xl text-navy-dark mb-3 leading-tight">
            {offer.headline}
          </h2>

          <p className="mb-4 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 text-navy-dark">
            {offer.compareAtPrice != null && (
              <del className="font-heading text-xl md:text-3xl text-navy-dark/75 decoration-2">
                <span className="sr-only">Regular price: </span>
                {formatMoney(offer.compareAtPrice)}
              </del>
            )}
            <span className="font-heading text-3xl md:text-5xl font-bold">
              {offer.compareAtPrice != null && <span className="sr-only">Offer price: </span>}
              {formatMoney(pricing.fullArchPerArch)}
            </span>
            <span className="text-navy-dark/80 text-lg md:text-2xl">{offer.unitLabel}</span>
          </p>

          <p className="text-navy-dark text-sm md:text-base max-w-lg mx-auto">
            {offer.body}
          </p>
          {offer.endsOn && (
            <p className="mt-2 text-navy-dark text-sm font-semibold">Offer ends {formatOfferEnd(offer.endsOn)}</p>
          )}
          <div className="mb-6" />

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
