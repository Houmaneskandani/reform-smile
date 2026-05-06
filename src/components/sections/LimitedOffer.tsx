"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

export default function LimitedOffer() {
  return (
    <section className="py-10 md:py-14 bg-gold relative overflow-hidden">
      {/* Subtle shine effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDuration: "3s" }} />
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
              Limited Time Offer
            </span>
          </div>

          <h3 className="font-heading text-2xl md:text-4xl text-white mb-3 leading-tight">
            Full Mouth Dental Implants or Veneers
          </h3>

          <p className="text-white text-3xl md:text-5xl font-heading font-bold mb-4">
            $9,000 <span className="text-white/70 text-lg md:text-2xl font-normal">Per Arch</span>
          </p>

          <p className="text-white/70 text-sm md:text-base mb-6 max-w-lg mx-auto">
            Full arch of implants with zirconia teeth, full arch of veneers, or a combination — all at one price.
          </p>

          <a
            href="/consultation"
            className="inline-flex items-center gap-2 bg-white text-gold hover:bg-white/90 font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            Claim This Offer
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
