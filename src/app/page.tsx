"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ClinicalHero from "@/components/clinical/ClinicalHero";
import ProceduresSection from "@/components/clinical/ProceduresSection";
import MethodSection from "@/components/clinical/MethodSection";
import ClinicalFooter from "@/components/clinical/ClinicalFooter";
import CustomCursor from "@/components/clinical/CustomCursor";
import LoadingScreen from "@/components/clinical/LoadingScreen";
import CTASection from "@/components/sections/CTASection";

const ClinicalTeeth = dynamic(() => import("@/components/3d/ClinicalTeeth"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <LoadingScreen onComplete={handleLoadComplete} />
      <CustomCursor />

      {/* 3D scene — fixed, orbits as user scrolls through entire page */}
      <div className="hidden md:block">
        <ClinicalTeeth />
      </div>

      {/* Navy gradient background — fixed behind 3D */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, #0F2440 0%, #1B3A5C 35%, #2A4F7A 65%, #1B3A5C 100%)" }}
      />

      {/* Scrollable content — each section is semi-transparent so 3D shows through */}
      <div className="relative z-10">
        {/* Hero text — fully transparent bg, teeth visible behind */}
        <ClinicalHero loaded={loaded} />

        {/* Scroll space — pure 3D orbiting, no content */}
        <div className="h-[150vh]" />

        {/* Content fades in with backdrop */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F5F0EB]/95 to-[#F5F0EB] h-[300px] -top-[300px] pointer-events-none" />
          <ProceduresSection />
          <MethodSection />
          <CTASection />
          <ClinicalFooter />
        </div>
      </div>
    </>
  );
}
