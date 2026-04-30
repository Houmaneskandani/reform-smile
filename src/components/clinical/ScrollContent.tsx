"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const sections = [
  {
    type: "review" as const,
    name: "Sarah M.",
    procedure: "All-on-4 Patient",
    stars: 5,
    text: "Dr. Pournejad gave me my life back. After years of hiding my smile, I can finally laugh without covering my mouth.",
  },
  {
    type: "stat" as const,
    value: "500+",
    label: "Successful Implant Procedures",
    detail: "Every smile engineered with precision and care.",
  },
  {
    type: "review" as const,
    name: "James R.",
    procedure: "Full Arch Restoration",
    stars: 5,
    text: "I visited five dentists before finding Reform Smile. Dr. Pournejad was the only one who took the time to truly understand what I needed.",
  },
  {
    type: "stat" as const,
    value: "1 Day",
    label: "Same-Day Smile Transformations",
    detail: "Walk in with missing teeth. Walk out with a brand new smile.",
  },
  {
    type: "review" as const,
    name: "Maria L.",
    procedure: "Teeth-in-a-Day",
    stars: 5,
    text: "The whole process was smoother than I ever imagined. I was terrified of dental work, but the team made me feel completely at ease.",
  },
];

export default function ScrollContent() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // This component lives in the scroll spacer area (after hero, before content)
      // Map scroll position to which section should be visible
      const heroHeight = window.innerHeight;
      const scrollSpaceStart = heroHeight;
      const scrollSpaceEnd = heroHeight + window.innerHeight * 1.5; // 150vh spacer
      const scrollY = window.scrollY;

      if (scrollY < scrollSpaceStart || scrollY > scrollSpaceEnd) {
        setActiveIndex(-1);
        return;
      }

      const progress = (scrollY - scrollSpaceStart) / (scrollSpaceEnd - scrollSpaceStart);
      const index = Math.floor(progress * sections.length);
      setActiveIndex(Math.min(index, sections.length - 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none">
      <div className="section-container h-full flex items-center">
        <div className="max-w-md">
          {sections.map((section, i) => (
            <div
              key={i}
              className={`absolute transition-all duration-700 ease-out ${
                activeIndex === i
                  ? "opacity-100 translate-y-0"
                  : activeIndex > i
                    ? "opacity-0 -translate-y-8"
                    : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: activeIndex === i ? "100ms" : "0ms" }}
            >
              {section.type === "review" ? (
                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(section.stars)].map((_, j) => (
                      <Star key={j} size={14} className="text-[#C4A265] fill-[#C4A265]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-6 italic">
                    &ldquo;{section.text}&rdquo;
                  </p>

                  {/* Attribution */}
                  <div>
                    <p className="text-white font-medium text-sm">{section.name}</p>
                    <p
                      className="text-[11px] tracking-[0.2em] uppercase mt-1"
                      style={{
                        fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                        color: "#C4A265",
                      }}
                    >
                      {section.procedure} *
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Big stat number */}
                  <p
                    className="text-6xl md:text-7xl font-light tracking-[-0.03em] mb-3"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "#C4A265",
                    }}
                  >
                    {section.value}
                  </p>

                  {/* Label */}
                  <p className="text-white text-lg md:text-xl font-light mb-3">
                    {section.label}
                  </p>

                  {/* Detail */}
                  <p className="text-white/40 text-sm">
                    {section.detail}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Scroll progress indicator */}
          {activeIndex >= 0 && (
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              {sections.map((_, i) => (
                <div
                  key={i}
                  className={`w-px transition-all duration-500 ${
                    activeIndex === i ? "h-8 bg-[#C4A265]" : "h-3 bg-white/15"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
