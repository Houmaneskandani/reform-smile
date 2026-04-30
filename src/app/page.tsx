"use client";

import { useState, useCallback } from "react";
import ClinicalHero from "@/components/clinical/ClinicalHero";
import ProceduresSection from "@/components/clinical/ProceduresSection";
import MethodSection from "@/components/clinical/MethodSection";
import ClinicalFooter from "@/components/clinical/ClinicalFooter";
import CustomCursor from "@/components/clinical/CustomCursor";
import LoadingScreen from "@/components/clinical/LoadingScreen";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <LoadingScreen onComplete={handleLoadComplete} />
      <CustomCursor />
      <ClinicalHero loaded={loaded} />
      <ProceduresSection />
      <MethodSection />
      <CTASection />
      <ClinicalFooter />
    </>
  );
}
