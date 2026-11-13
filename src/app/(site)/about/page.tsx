import type { Metadata } from "next";
import AboutHero from "./AboutHero";
import DoctorBio from "./DoctorBio";
import Mission from "./Mission";
import Technology from "./Technology";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "About Dr. Ava",
  alternates: { canonical: "/about" },
  description:
    "Meet Dr. Ava, a skilled dental implant specialist dedicated to transforming smiles with All-on-X dental implants at Reform Dental & Implant Center.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <DoctorBio />
      <Mission />
      <Technology />
      <CTASection />
    </>
  );
}
