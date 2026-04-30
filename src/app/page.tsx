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

      {/* 3D scene — FIXED behind everything, camera orbits on scroll */}
      <div className="hidden md:block">
        <ClinicalTeeth />
      </div>

      {/* Full-page navy background behind the 3D scene */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, #0F2440 0%, #1B3A5C 40%, #1B3A5C 60%, #0F2440 100%)" }}
      />

      {/* Scrollable content layered on top */}
      <div className="relative z-10">
        {/* Hero — transparent so 3D shows through */}
        <ClinicalHero loaded={loaded} />

        {/* Spacer — lets user scroll while seeing just 3D + orbiting camera */}
        <div className="h-[100vh]" />

        {/* Content sections with solid backgrounds */}
        <ProceduresSection />
        <MethodSection />
        <CTASection />
        <ClinicalFooter />
      </div>
    </>
  );
}
