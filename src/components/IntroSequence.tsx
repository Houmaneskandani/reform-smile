"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";

const INTRO_SEEN_KEY = "intro-seen";
// Phase 1: show logo (1.2s), Phase 2: fade out (0.5s)
const LOGO_DURATION_MS = 1200;
const FADE_DURATION_MS = 500;

// Play the intro once per browser session, and never for visitors whose system
// asks for reduced motion.
function shouldPlayIntro() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !window.sessionStorage.getItem(INTRO_SEEN_KEY);
  } catch {
    // Storage blocked (strict privacy settings): skip it rather than replay it on every load.
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "true");
  } catch {
    // Storage blocked — nothing to remember.
  }
}

// Nothing to subscribe to: the answer only changes when the intro itself finishes,
// and that re-renders the component anyway.
const subscribe = () => () => {};
// The server can't read sessionStorage, so it always renders the intro (the first
// client render matches it); return visits drop it right after hydration.
const shouldPlayOnServer = () => true;
// false on the server and during hydration, true from then on
const isHydrated = () => true;
const isHydratedOnServer = () => false;

// Return visits shouldn't see even a flash of the server-rendered overlay while the page's
// JavaScript loads. This runs inline, before the overlay is painted, with the same rules as
// shouldPlayIntro(), and hides it with a stylesheet in <head> (React allows extra <head>
// tags during hydration, so nothing mismatches).
const HIDE_ON_RETURN_VISIT_SCRIPT = `(function(){try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem(${JSON.stringify(
  INTRO_SEEN_KEY
)}))return}catch(e){}var s=document.createElement("style");s.textContent=".intro-overlay{display:none!important}";document.head.appendChild(s)})()`;

export default function IntroSequence() {
  const shouldPlay = useSyncExternalStore(subscribe, shouldPlayIntro, shouldPlayOnServer);
  const hydrated = useSyncExternalStore(subscribe, isHydrated, isHydratedOnServer);
  const [phase, setPhase] = useState<"logo" | "fade" | "done">("logo");

  useEffect(() => {
    if (!shouldPlay) return;

    const fadeTimer = setTimeout(() => setPhase("fade"), LOGO_DURATION_MS);
    const doneTimer = setTimeout(() => {
      markIntroSeen();
      setPhase("done");
    }, LOGO_DURATION_MS + FADE_DURATION_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [shouldPlay]);

  if (!shouldPlay || phase === "done") return null;

  const fading = phase === "fade";

  return (
    <>
      {/* Only in the server HTML (kept during hydration so it matches); React never creates it on the client */}
      {!hydrated && <script dangerouslySetInnerHTML={{ __html: HIDE_ON_RETURN_VISIT_SCRIPT }} />}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: FADE_DURATION_MS / 1000 }}
        // Safety net: if JavaScript is slow or fails, CSS still clears the overlay after 3s
        // so the site is never stuck behind it.
        style={{ animation: "intro-failsafe 0.5s ease 3s forwards" }}
        className={`intro-overlay fixed inset-0 z-[10000] bg-navy-dark flex items-center justify-center motion-reduce:hidden${
          fading ? " pointer-events-none" : ""
        }`}
      >
        <style>{`@keyframes intro-failsafe { to { opacity: 0; visibility: hidden; } }`}</style>

        {/* Gold "R" draws in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: fading ? 0 : 1,
            scale: fading ? 1.1 : 1,
          }}
          transition={{ duration: fading ? 0.5 : 0.6 }}
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
    </>
  );
}
