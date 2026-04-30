"use client";

import Image from "next/image";

export default function ClinicalHero({ loaded }: { loaded: boolean }) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Logo top left */}
      <div
        className={`absolute top-8 left-8 z-20 transition-all duration-1000 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <Image
          src="/logo-white.png"
          alt="Reform Smile"
          width={200}
          height={200}
          className="h-20 md:h-28 w-auto"
          priority
        />
      </div>

      {/* Nav top right */}
      <div
        className={`absolute top-10 right-8 z-20 hidden md:flex items-center gap-8 transition-all duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "800ms" }}
      >
        {["About", "Services", "Gallery", "Contact"].map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-[#C4A265] transition-colors"
            style={{ fontFamily: '"JetBrains Mono", "SF Mono", monospace' }}
          >
            {item}
          </a>
        ))}
      </div>

      {/* Center tagline — positioned to the left to avoid 3D overlap */}
      <div className="relative z-10 section-container w-full">
        <div className="max-w-lg">
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-[0.95] transition-all duration-1000 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "var(--font-heading)",
              color: "#ffffff",
              transitionDelay: "300ms",
            }}
          >
            Precision.<br />
            Permanence.<br />
            <span className="text-[#C4A265] italic">Perfection.</span>
          </h1>

          <div
            className={`mt-8 transition-all duration-1000 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="w-12 h-px bg-[#C4A265] mb-6" />
            <p className="text-white/40 text-sm md:text-base leading-relaxed max-w-sm">
              Dr. Ava Pournejad specializes in All-on-X dental implants.
              Permanent, life-changing smiles — engineered with precision.
            </p>
          </div>

          <p
            className={`mt-6 text-[10px] tracking-[0.4em] uppercase transition-all duration-1000 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              fontFamily: '"JetBrains Mono", "SF Mono", monospace',
              color: "#C4A265",
              opacity: 0.5,
              transitionDelay: "1000ms",
            }}
          >
            Reform Smile & Dental Implant Center
          </p>
        </div>
      </div>

      {/* Scroll indicator bottom center */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 transition-all duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1500ms" }}
      >
        <span
          className="text-[9px] tracking-[0.3em] uppercase text-white/15"
          style={{ fontFamily: '"JetBrains Mono", "SF Mono", monospace' }}
        >
          Scroll to explore
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#C4A265]/30 to-transparent" />
      </div>
    </section>
  );
}
