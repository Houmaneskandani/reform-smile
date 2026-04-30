import type { Metadata } from "next";
import ServicesHero from "./ServicesHero";
import ServicesList from "./ServicesList";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore our dental implant services including All-on-4, All-on-6, Teeth-in-a-Day, bone grafting, and full mouth reconstruction at Reform Smile.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <CTASection />
    </>
  );
}
