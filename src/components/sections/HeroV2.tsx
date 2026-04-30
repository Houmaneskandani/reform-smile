"use client";

import { motion } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

// Lazy load the 3D scene — no SSR for WebGL
const ToothScene = dynamic(() => import("@/components/3d/ToothScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-0 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
    </div>
  ),
});

export default function HeroV2() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-24">
      {/* Deep navy gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080F1A] via-[#0D1B2E] to-navy-dark" />

      {/* Subtle radial glow behind the 3D model */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/[0.03] blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-navy-light/20 blur-[80px]" />
      </div>

      {/* 3D Tooth Scene */}
      <ToothScene />

      {/* Content overlay */}
      <div className="relative z-10 section-container pt-36 md:pt-44 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="inline-block bg-gold/10 backdrop-blur-sm border border-gold/20 text-gold px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-8">
                Now Accepting New Patients
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="font-heading text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-8"
            >
              The Future of{" "}
              <span className="relative">
                <span className="text-gold italic">Your Smile</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                  className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent origin-left"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-white/50 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0"
            >
              Dr. Ava Pournejad combines cutting-edge implant technology with
              artistry to deliver permanent, life-changing smiles — often in
              just one visit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16"
            >
              <Button href="/consultation" variant="gold" size="lg">
                Schedule Free Consultation
              </Button>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/10 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all duration-300 font-medium backdrop-blur-sm"
              >
                <Phone size={18} />
                {SITE_CONFIG.phone}
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="flex justify-center lg:justify-start gap-12"
            >
              {[
                { value: "500+", label: "Implants Placed" },
                { value: "5.0", label: "Patient Rating" },
                { value: "1 Day", label: "Same-Day Smiles" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-gold text-2xl md:text-3xl font-heading font-bold">
                    {stat.value}
                  </p>
                  <p className="text-white/30 text-[11px] mt-1 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side — empty, the 3D model occupies this space via the canvas */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-[10px] uppercase tracking-[0.3em]">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-gold/40" />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent z-10 pointer-events-none" />
    </section>
  );
}
