"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ClinicalTeeth = dynamic(() => import("@/components/3d/ClinicalTeeth"), {
  ssr: false,
  loading: () => null,
});

export default function ClinicalHero({ loaded }: { loaded: boolean }) {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#f4f5f7" }}
    >
      {/* 3D Teeth — hidden on mobile */}
      <div className="hidden md:block">
        <ClinicalTeeth />
      </div>

      {/* Mobile fallback — static image placeholder */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-[#edeef0] flex items-center justify-center">
          <span className="text-[#b0b3b8] text-xs tracking-widest uppercase font-mono">
            3D View on Desktop
          </span>
        </div>
      </div>

      {/* Text overlay */}
      <div className="relative z-10 text-center pointer-events-none select-none">
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.03em] leading-none transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            fontFamily: 'var(--font-grotesk)',
            color: "#0a0a0a",
            transitionDelay: "200ms",
          }}
        >
          Precision.<br />
          Permanence.<br />
          <span style={{ color: "#00b8c4" }}>Perfection.</span>
        </h1>

        <p
          className={`mt-8 text-[10px] sm:text-[11px] tracking-[0.4em] uppercase transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            fontFamily: '"JetBrains Mono", "SF Mono", monospace',
            color: "#b0b3b8",
            transitionDelay: "600ms",
          }}
        >
          Specimen 001 / 2026
        </p>

        {/* Click instruction */}
        <p
          className={`mt-16 text-[9px] tracking-[0.3em] uppercase transition-all duration-1000 hidden md:block ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            fontFamily: '"JetBrains Mono", "SF Mono", monospace',
            color: "#c8cad0",
            transitionDelay: "1200ms",
          }}
        >
          Click to chomp &middot; Scroll to disassemble
        </p>
      </div>

      {/* Bottom edge line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "#e0e2e6" }}
      />
    </section>
  );
}
