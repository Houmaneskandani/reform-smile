"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] md:min-h-screen flex items-center overflow-hidden -mt-24">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-[85%_20%] md:object-center"
        >
          <source src="/images/video/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/70 via-navy/50 to-navy-dark/80 md:bg-gradient-to-r md:from-navy-dark/95 md:via-navy/80 md:to-navy/40" />

      <div className="relative section-container pt-24 md:pt-44 pb-6 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-gold/20 text-gold px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-8">
                Now Accepting New Patients
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-5 md:mb-8"
            >
              Get Back Your{" "}
              <span className="text-gold italic">Confident</span>{" "}
              Smile
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/75 text-base md:text-xl leading-relaxed mb-6 md:mb-12 max-w-xl mx-auto lg:mx-0"
            >
              Dr. Ava Pournejad specializes in All-on-X dental implants —
              permanent, natural-looking teeth that transform your life.
              Often completed in just one visit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6 md:mb-16"
            >
              {/* Primary CTA — smile-meter + shine sweep + tooltip */}
              <div className="relative group">
                <a
                  href="/consultation"
                  className="relative inline-flex items-center justify-center gap-3 bg-gold hover:bg-gold-dark text-white font-bold px-9 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-gold/25 hover:shadow-xl hover:scale-[1.03] overflow-hidden text-lg whitespace-nowrap"
                >
                  {/* Shine sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />

                  {/* Smile icon that grows on hover */}
                  <svg
                    className="relative w-6 h-6 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="opacity-80" />
                    <circle cx="9" cy="10" r="1.2" fill="currentColor" />
                    <circle cx="15" cy="10" r="1.2" fill="currentColor" />
                    {/* Small smile — visible at rest */}
                    <path
                      d="M9 15 C10 16.5, 14 16.5, 15 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                    />
                    {/* Big smile — visible on hover */}
                    <path
                      d="M7.5 14.5 C9 18, 15 18, 16.5 14.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </svg>

                  <span className="relative">Book My Free Consult</span>
                </a>

                {/* Tooltip on hover */}
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-navy-dark text-white text-[11px] px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block shadow-xl">
                  Free 30-min consult &bull; No obligation &bull; $0 due today
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-navy-dark rotate-45" />
                </div>
              </div>

              {/* Phone button — wiggle + pulse ring */}
              <div className="relative group">
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
                  className="relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-white/30 text-white hover:bg-white hover:text-navy transition-all duration-300 font-semibold whitespace-nowrap hover:border-white"
                >
                  {/* Phone icon with wiggle on hover */}
                  <motion.span
                    whileHover={{
                      rotate: [0, -12, 12, -8, 8, -4, 0],
                      transition: { duration: 0.6 },
                    }}
                    className="inline-flex"
                  >
                    <Phone size={18} />
                  </motion.span>
                  {SITE_CONFIG.phone}
                </a>

              </div>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="hidden md:flex justify-center lg:justify-start gap-12 border-t border-white/10 pt-10"
            >
              <div className="text-center lg:text-left">
                <p className="text-gold text-3xl md:text-4xl font-heading font-bold">500+</p>
                <p className="text-white/50 text-xs mt-2 uppercase tracking-wider">Successful Implants</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-gold text-3xl md:text-4xl font-heading font-bold">5.0</p>
                <p className="text-white/50 text-xs mt-2 uppercase tracking-wider">Patient Rating</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-gold text-3xl md:text-4xl font-heading font-bold">1 Day</p>
                <p className="text-white/50 text-xs mt-2 uppercase tracking-wider">Same-Day Smiles</p>
              </div>
            </motion.div>
          </div>

          {/* Right side — empty, video shows through */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
