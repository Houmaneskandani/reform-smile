"use client";

import { motion } from "framer-motion";

export default function BlogHero() {
  return (
    <section className="relative py-32 md:py-40 bg-navy overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl" />
      </div>
      <div className="relative section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            Our Blog
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Dental Implant <span className="text-gold italic">Insights</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Expert articles, patient education, and the latest in dental implant
            technology from Dr. Pournejad.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
