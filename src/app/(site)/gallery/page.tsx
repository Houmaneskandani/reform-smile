import type { Metadata } from "next";
import GalleryHero from "./GalleryHero";
import GalleryGrid from "./GalleryGrid";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Smile Gallery",
  description:
    "View before and after photos of real patients who have transformed their smiles with dental implants at Reform Smile & Dental Implant Center.",
};

export default function GalleryPage() {
  return (
    <>
      <GalleryHero />
      <GalleryGrid />
      <CTASection />
    </>
  );
}
