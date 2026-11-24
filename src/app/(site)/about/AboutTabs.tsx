"use client";

import { useState } from "react";
import Mission from "./Mission";
import Technology from "./Technology";
import DoctorBio from "./DoctorBio";

const TABS = [
  { id: "practice", label: "Reform Dental & Implant Center" },
  { id: "team", label: "Meet the Team" },
];

export default function AboutTabs() {
  const [active, setActive] = useState<"practice" | "team">("practice");

  return (
    <div>
      {/* Tab bar */}
      <div className="bg-white border-b border-gray-lighter sticky top-[72px] z-30">
        <div className="section-container">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id as "practice" | "team")}
                className={`relative py-5 px-6 text-sm font-semibold tracking-wide transition-colors duration-200 ${
                  active === tab.id
                    ? "text-navy"
                    : "text-gray hover:text-navy"
                }`}
              >
                {tab.label}
                {active === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      {active === "practice" && (
        <>
          <Mission />
          <Technology />
        </>
      )}
      {active === "team" && <DoctorBio />}
    </div>
  );
}
