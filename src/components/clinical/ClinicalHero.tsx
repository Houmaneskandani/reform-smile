"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const ClinicalTeeth = dynamic(() => import("@/components/3d/ClinicalTeeth"), {
  ssr: false,
  loading: () => null,
});

export default function ClinicalHero({ loaded }: { loaded: boolean }) {
  return (
    <section
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0F2440 0%, #1B3A5C 50%, #2A4F7A 100%)" }}
    >
      {/* 3D Teeth — hidden on mobile */}
      <div className="hidden md:block">
        <ClinicalTeeth />
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-white/5 flex items-center justify-center">
          <span className="text-white/30 text-xs tracking-widest uppercase font-mono">
            3D View on Desktop
          </span>
        </div>
      </div>

      {/* Logo at top */}
      <div
        className={`absolute top-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <Image
          src="/logo-white.png"
          alt="Reform Smile"
          width={200}
          height={200}
          className="h-20 w-auto"
          priority
        />
      </div>

      {/* Text overlay */}
      <div className="relative z-10 text-center pointer-events-none select-none">
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.03em] leading-none transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            fontFamily: "var(--font-heading)",
            color: "#ffffff",
            transitionDelay: "200ms",
          }}
        >
          Precision.<br />
          Permanence.<br />
          <span style={{ color: "#C4A265" }}>Perfection.</span>
        </h1>

        <p
          className={`mt-8 text-[10px] sm:text-[11px] tracking-[0.4em] uppercase transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            fontFamily: '"JetBrains Mono", "SF Mono", monospace',
            color: "rgba(196,162,101,0.5)",
            transitionDelay: "600ms",
          }}
        >
          Dr. Ava Pournejad, DDS &middot; Reform Smile
        </p>

        {/* Click instruction */}
        <p
          className={`mt-16 text-[9px] tracking-[0.3em] uppercase transition-all duration-1000 hidden md:block ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            fontFamily: '"JetBrains Mono", "SF Mono", monospace',
            color: "rgba(255,255,255,0.2)",
            transitionDelay: "1200ms",
          }}
        >
          Click to chomp &middot; Scroll to disassemble
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-all duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1500ms" }}
      >
        <span
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: '"JetBrains Mono", "SF Mono", monospace',
            color: "rgba(255,255,255,0.15)",
          }}
        >
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[#C4A265]/40 to-transparent" />
      </div>

      {/* Bottom fade to cream */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F0EB] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
