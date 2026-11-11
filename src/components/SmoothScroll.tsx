"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SmoothScroll() {
  useEffect(() => {
    // Keep the browser's native scrolling for visitors who ask for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Let scrollable panels (e.g. the chat window) scroll themselves instead of the page
      allowNestedScroll: true,
      // Stop any leftover momentum when a link is clicked, so the new page starts at the top
      stopInertiaOnNavigate: true,
    });

    let frameId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
