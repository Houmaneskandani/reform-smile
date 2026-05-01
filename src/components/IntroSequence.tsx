"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroSequence() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"logo" | "fade">("logo");

  useEffect(() => {
    // Skip on return visits
    if (sessionStorage.getItem("intro-seen")) {
      setShow(false);
      return;
    }

    // Phase 1: show logo (1.2s), Phase 2: fade out (0.5s)
    const logoTimer = setTimeout(() => setPhase("fade"), 1200);
    const hideTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("intro-seen", "true");
    }, 1700);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[10000] bg-navy-dark flex items-center justify-center"
        >
          {/* Gold "R" draws in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: phase === "fade" ? 0 : 1,
              scale: phase === "fade" ? 1.1 : 1,
            }}
            transition={{ duration: phase === "fade" ? 0.5 : 0.6 }}
            className="text-center"
          >
            {/* Animated R */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="block text-gold text-7xl md:text-8xl font-heading mb-4"
            >
              R
            </motion.span>

            {/* Line draws in */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-16 h-px bg-gold/50 mx-auto mb-4 origin-center"
            />

            {/* Text fades in */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="text-white/30 text-[10px] tracking-[0.4em] uppercase"
            >
              Reform Smile
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
