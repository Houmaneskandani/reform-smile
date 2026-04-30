"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ClinicalHero from "@/components/clinical/ClinicalHero";
import ScrollContent from "@/components/clinical/ScrollContent";
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

      {/* 3D scene — fixed, rotates on scroll */}
      <div className="hidden md:block">
        <ClinicalTeeth />
      </div>

      {/* Navy gradient background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, #0F2440 0%, #1B3A5C 35%, #2A4F7A 65%, #1B3A5C 100%)" }}
      />

      {/* Scrollable content */}
      <div className="relative z-10">
        <ClinicalHero loaded={loaded} />

        {/* Reviews scroll naturally on the left, tooth stays on right */}
        <ScrollContent />

        {/* Content sections */}
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
