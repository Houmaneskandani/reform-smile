import type { Metadata } from "next";
import AboutHero from "./AboutHero";
import AboutTabs from "./AboutTabs";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description:
    "Learn about Reform Dental & Implant Center and meet Dr. Ava, a skilled dental implant specialist dedicated to transforming smiles with All-on-X dental implants.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutTabs />
      <CTASection />
    </>
  );
}
