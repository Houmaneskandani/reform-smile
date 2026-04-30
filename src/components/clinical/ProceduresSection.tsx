"use client";

import { useRef, useEffect } from "react";

const procedures = [
  {
    id: "01",
    title: "All-on-X Implants",
    subtitle: "Full Arch Restoration",
    specs: [
      "Titanium Grade 5 ELI",
      "4-6 implant posts per arch",
      "Zirconia prosthetic framework",
      "Same-day provisional placement",
    ],
    description:
      "Complete arch replacement using strategically angled implants for maximum bone contact and immediate loading capability.",
  },
  {
    id: "02",
    title: "Guided Surgery",
    subtitle: "3D Digital Planning",
    specs: [
      "CBCT volumetric imaging",
      "0.1mm placement accuracy",
      "Surgical guide fabrication",
      "Virtual treatment simulation",
    ],
    description:
      "Computer-guided implant placement using cone-beam CT data for predictable outcomes with sub-millimeter precision.",
  },
  {
    id: "03",
    title: "Bone Augmentation",
    subtitle: "Foundation Protocol",
    specs: [
      "Autogenous / xenograft material",
      "GBR membrane technique",
      "4-6 month integration period",
      "Ridge preservation protocol",
    ],
    description:
      "Advanced bone regeneration procedures to establish adequate volume and density for optimal implant anchorage.",
  },
];

export default function ProceduresSection() {
  return (
    <section className="py-32 md:py-40" style={{ background: "#f4f5f7" }}>
      <div className="section-container">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-20">
          <span
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{
              fontFamily: '"JetBrains Mono", "SF Mono", monospace',
              color: "#00b8c4",
            }}
          >
            Procedures
          </span>
          <div className="flex-1 h-px" style={{ background: "#e0e2e6" }} />
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "#e0e2e6" }}>
          {procedures.map((proc) => (
            <div
              key={proc.id}
              className="group relative bg-[#f4f5f7] p-8 md:p-10 transition-colors duration-300 hover:bg-[#edeef0]"
            >
              {/* Number */}
              <span
                className="text-[10px] tracking-[0.3em] uppercase block mb-8"
                style={{
                  fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                  color: "#b0b3b8",
                }}
              >
                {proc.id}
              </span>

              {/* Title */}
              <h3
                className="text-2xl md:text-3xl font-light tracking-[-0.02em] mb-2"
                style={{
                  fontFamily: 'var(--font-grotesk)',
                  color: "#0a0a0a",
                }}
              >
                {proc.title}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "#b0b3b8" }}
              >
                {proc.subtitle}
              </p>

              {/* Description */}
              <p
                className="text-[14px] leading-relaxed mb-8"
                style={{ color: "#6b6f76" }}
              >
                {proc.description}
              </p>

              {/* Technical specs — revealed on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="h-px mb-6"
                  style={{ background: "#00b8c4", opacity: 0.3 }}
                />
                <ul className="space-y-2">
                  {proc.specs.map((spec) => (
                    <li
                      key={spec}
                      className="text-[11px] tracking-[0.05em]"
                      style={{
                        fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                        color: "#00b8c4",
                      }}
                    >
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
