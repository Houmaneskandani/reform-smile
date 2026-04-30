"use client";

import { useRef, useEffect, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Diagnostic imaging and volumetric analysis",
    detail: "CBCT scan / Digital impression / Bone density mapping",
  },
  {
    number: "02",
    title: "Virtual surgical planning and guide fabrication",
    detail: "Implant position simulation / Prosthetic-driven placement / 3D-printed surgical guide",
  },
  {
    number: "03",
    title: "Precision implant placement under guided protocol",
    detail: "Flapless technique when indicated / Immediate provisional loading / Torque-verified seating",
  },
  {
    number: "04",
    title: "Osseointegration monitoring and prosthetic design",
    detail: "Integration verification / Final impression / Custom abutment milling",
  },
  {
    number: "05",
    title: "Definitive prosthetic delivery and calibration",
    detail: "Zirconia framework try-in / Occlusal adjustment / Final cementation or screw-retention",
  },
];

export default function MethodSection() {
  const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleLines((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.3 }
    );

    lineRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-32 md:py-40 bg-white">
      <div className="section-container">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-20">
          <span
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{
              fontFamily: '"JetBrains Mono", "SF Mono", monospace',
              color: "#C4A265",
            }}
          >
            Method
          </span>
          <div className="flex-1 h-px bg-[#E8E0D6]" />
        </div>

        {/* Kinetic text lines */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => { lineRefs.current[index] = el; }}
              data-index={index}
              className={`flex gap-6 md:gap-12 py-10 md:py-14 border-b border-[#E8E0D6] transition-all duration-700 ease-out ${
                visibleLines.has(index)
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-[-40px]"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Line number */}
              <span
                className="text-[11px] tracking-[0.2em] pt-2 flex-shrink-0 w-8"
                style={{
                  fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                  color: "#C4A265",
                }}
              >
                {step.number}
              </span>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className="text-2xl md:text-4xl lg:text-5xl font-light tracking-[-0.02em] leading-tight mb-4"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#1B3A5C",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[11px] md:text-[12px] tracking-[0.05em] leading-relaxed"
                  style={{
                    fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                    color: "#9A8E7E",
                  }}
                >
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
