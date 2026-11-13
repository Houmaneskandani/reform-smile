"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { useEffect, useState } from "react";
import { preload } from "react-dom";

function useGyroShine() {
  const [position, setPosition] = useState(50);
  // Until the device reports its tilt, the CSS shine animation is used instead
  const [fallback, setFallback] = useState(true);

  useEffect(() => {
    // No tilt-driven effect for visitors who ask for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null) return;
      setFallback(false);
      // Offset for natural phone holding angle; whole numbers so tiny sensor jitter
      // doesn't re-render the hero on every event
      const normalized = Math.max(0, Math.min(100, ((e.gamma + 25) / 50) * 100));
      setPosition(Math.round(normalized));
    };

    const requestPermission = async () => {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DOE.requestPermission === "function") {
        try {
          const result = await DOE.requestPermission();
          if (result === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } catch { /* denied */ }
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    };

    // iOS requires click gesture for permission
    const handleClick = () => {
      requestPermission();
      document.removeEventListener("click", handleClick);
    };
    document.addEventListener("click", handleClick);
    requestPermission();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return { position, fallback };
}

export default function Hero() {
  const { position, fallback } = useGyroShine();
  // Ask the browser for the hero's still image straight away, ahead of scripts and fonts.
  preload("/images/video/hero-poster.jpg", { as: "image", fetchPriority: "high" });
  return (
    <section className="on-dark relative min-h-[85vh] md:min-h-screen flex items-end md:items-center overflow-hidden -mt-24">
      {/* Video Background — navy behind it so the white headline stays readable while it loads */}
      <div className="absolute inset-0 bg-navy-dark" aria-hidden="true">
        {/* The video's first frame as a plain image: it is the largest thing on the first
            screen, so it loads first (preloaded above) and the video fades in over it.
            A plain <img>, not next/image: the file is already sized and compressed. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/video/hero-poster.jpg"
          alt=""
          fetchPriority="high"
          decoding="sync"
          className="absolute inset-0 w-full h-full object-cover object-[85%_10%] md:object-[85%_center] lg:object-center"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover object-[85%_10%] md:object-[85%_center] lg:object-center"
        >
          <source src="/images/video/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay — mobile: light top, dark bottom / tablet+desktop: dark left, transparent right */}
      <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to bottom, rgba(15,36,64,0.05) 0%, rgba(15,36,64,0.08) 20%, rgba(15,36,64,0.2) 40%, rgba(15,36,64,0.6) 55%, rgba(15,36,64,0.92) 75%)" }} />
      <div className="absolute inset-0 hidden md:block lg:hidden" style={{ background: "linear-gradient(to right, rgba(15,36,64,0.92) 0%, rgba(27,58,92,0.7) 40%, rgba(27,58,92,0.3) 65%, transparent 85%)" }} />
      <div className="absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(to right, rgba(15,36,64,0.95) 0%, rgba(27,58,92,0.75) 35%, rgba(27,58,92,0.3) 60%, transparent 80%)" }} />

      <div className="relative section-container pt-24 md:pt-44 pb-6 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            {/* Badge — top on desktop, moved below CTA on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden md:block"
            >
              <span className="inline-block bg-navy-dark/70 border border-gold/40 text-gold-ink px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-8">
                Now Accepting New Patients
              </span>
            </motion.div>

            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-5 md:mb-8">
              {/* Plain text with real spaces, so Google and screen readers read the words
                  separately. The entrance is a CSS animation (globals.css), so the headline
                  shows without waiting for JavaScript. */}
              <span className="hero-rise inline-block">Get Back Your</span>{" "}
              <br className="hidden md:block" />
              <span className="hero-rise hero-rise-2 inline-block">
              <span
                className={`inline-block italic ${fallback ? "confident-shine motion-reduce:animate-none!" : ""}`}
                style={!fallback ? {
                  backgroundImage: `linear-gradient(105deg, #A8884D ${position - 30}%, #F0D890 ${position}%, #A8884D ${position + 30}%)`,
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                } : undefined}
              >
                Confident
              </span>
              </span>{" "}
              <span className="hero-rise hero-rise-3 inline-block">Smile</span>
              {/* What we do, in the words people search for. Part of the h1 on purpose. */}
              <span className="hero-rise hero-rise-3 block font-body font-medium text-sm md:text-lg text-white/80 tracking-wide mt-4 md:mt-6">
                Full Arch &amp; All-on-X Dental Implants
              </span>
            </h1>


            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-3 md:mb-16"
            >
              {/* Primary CTA — smile-meter + shine sweep + tooltip */}
              <div className="relative group">
                <a
                  href="/consultation"
                  className="relative inline-flex items-center justify-center gap-3 bg-gold hover:bg-gold-dark text-navy-dark font-bold px-9 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-gold/25 hover:shadow-xl hover:scale-[1.03] overflow-hidden text-lg whitespace-nowrap"
                >
                  {/* Shine sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />

                  <span className="relative">Book My Free Consult</span>

                  {/* Smile curve — widens on hover */}
                  <svg
                    className="relative w-7 h-4 flex-shrink-0"
                    viewBox="0 0 28 16"
                    fill="none"
                  >
                    <path
                      d="M8 6 C11 10, 17 10, 20 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                    />
                    <path
                      d="M4 4 C8 15, 20 15, 24 4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </svg>
                </a>

                {/* Tooltip on hover */}
                <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-navy-dark text-white text-[11px] px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block shadow-xl">
                  Free 30-min consult &bull; No obligation &bull; $0 due today
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-navy-dark rotate-45" />
                </div>
              </div>

              {/* Phone button — hidden on mobile (sticky bar handles it) */}
              <div className="relative group hidden md:block">
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

            {/* Badge — below CTA on mobile only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="md:hidden text-center mb-4"
            >
              <span className="inline-block bg-navy-dark/70 border border-gold/40 text-gold-ink px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                Now Accepting New Patients
              </span>
            </motion.div>

            {/* Trust stats — statistics claims; confirm with the doctor before launch */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="hidden md:flex justify-center lg:justify-start gap-12 border-t border-white/10 pt-10"
            >
              <div className="text-center lg:text-left">
                <p className="text-gold-ink text-3xl md:text-4xl font-heading font-bold">500+</p>
                <p className="text-white/75 text-xs mt-2 uppercase tracking-wider">Successful Implants</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-gold-ink text-3xl md:text-4xl font-heading font-bold">5.0</p>
                <p className="text-white/75 text-xs mt-2 uppercase tracking-wider">Patient Rating</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-gold-ink text-3xl md:text-4xl font-heading font-bold">1 Day</p>
                <p className="text-white/75 text-xs mt-2 uppercase tracking-wider">Same-Day Smiles</p>
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
