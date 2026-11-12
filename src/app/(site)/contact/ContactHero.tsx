"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="relative py-32 md:py-40 bg-navy overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl" />
      </div>
      <div className="relative section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            Get In Touch
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Contact <span className="text-gold italic">Us</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Have questions? We&apos;re here to help. Reach out to our team or
            schedule your free consultation today.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
