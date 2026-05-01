"use client";

import { motion } from "framer-motion";
import { Phone, Play } from "lucide-react";
import Button from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { useState } from "react";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-24">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/images/cases/case-4-prosthetic.jpg"
        >
          <source src="/images/video/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/80 to-navy/40" />

      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')]" />

      <div className="relative section-container pt-36 md:pt-44 pb-20 md:pb-28">
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
              className="font-heading text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-8"
            >
              Get Back Your{" "}
              <span className="text-gold italic">Confident</span>{" "}
              Smile
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/75 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0"
            >
              Dr. Ava Pournejad specializes in All-on-X dental implants —
              permanent, natural-looking teeth that transform your life.
              Often completed in just one visit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16"
            >
              <Button href="/consultation" variant="gold" size="lg">
                Schedule Free Consultation
              </Button>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-white/25 text-white hover:bg-white hover:text-navy transition-all duration-300 font-semibold"
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
              className="flex justify-center lg:justify-start gap-12 border-t border-white/10 pt-10"
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
