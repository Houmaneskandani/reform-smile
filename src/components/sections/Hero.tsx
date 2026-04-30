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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy/70 to-transparent" />

      {/* Subtle texture overlay */}
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

          {/* Right: Video / Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Main image/video placeholder */}
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10 shadow-2xl">
                <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-white/5 to-transparent">
                  <div className="w-36 h-36 rounded-full bg-gold/15 mb-8 flex items-center justify-center">
                    <span className="text-gold text-6xl font-heading">R</span>
                  </div>
                  <p className="text-white/30 text-sm">Dr. Pournejad&apos;s Photo</p>
                  <p className="text-white/20 text-xs mt-1">(Placeholder)</p>
                </div>
              </div>

              {/* Play button */}
              <button
                onClick={() => setShowVideo(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gold hover:bg-gold-dark flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl cursor-pointer"
                aria-label="Play video"
              >
                <Play size={30} className="text-white ml-1" fill="white" />
              </button>

              {/* Floating review card */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-5 shadow-2xl max-w-[240px] border border-gray-lighter">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-dark text-xs leading-relaxed">
                  &ldquo;Dr. Pournejad changed my life. I smile with confidence every day.&rdquo;
                </p>
                <p className="text-gold text-[11px] mt-2 font-semibold">— Happy Patient *</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-4xl aspect-video bg-navy-dark rounded-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Play size={64} className="text-gold mx-auto mb-4" />
                <p className="text-white text-lg">Patient Testimonial Video</p>
                <p className="text-white/50 text-sm mt-2">Video will be embedded here</p>
              </div>
            </div>
            <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer" aria-label="Close">
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
