"use client";

import { motion } from "framer-motion";
import { Phone, Play } from "lucide-react";
import Button from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { useState } from "react";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative min-h-[60vh] md:min-h-screen flex items-center overflow-hidden -mt-24">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-[75%_20%] md:object-center"
        >
          <source src="/images/video/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay — lighter on mobile so video face is visible */}
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
              <Button href="/consultation" variant="gold" size="lg">
                Schedule Free Consultation
              </Button>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-white/25 text-white hover:bg-white hover:text-navy transition-all duration-300 font-semibold whitespace-nowrap"
              >
                <Phone size={18} />
                {SITE_CONFIG.phone}
              </a>
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
