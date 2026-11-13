import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import TrustLogos from "@/components/sections/TrustLogos";
import LimitedOffer from "@/components/sections/LimitedOffer";
import Services from "@/components/sections/Services";
import BeforeAfterSlider from "@/components/sections/BeforeAfterSlider";
import CostEstimator from "@/components/sections/CostEstimator";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTASection from "@/components/sections/CTASection";
import type { Metadata } from "next";
import { pricing } from "@/content";
import { isOfferLive } from "@/content/format";
import { SITE_CONFIG } from "@/lib/constants";

// The canonical tag tells Google this address is the official one (the site is also reachable
// at ava-green.vercel.app). Every page sets its own; a shared one in the layout would be wrong.
export const metadata: Metadata = {
  title: { absolute: `Full Arch Dental Implants | ${SITE_CONFIG.name}` },
  alternates: { canonical: "/" },
};

export default function Home() {
  // Checked when the page is prerendered; LimitedOffer re-checks the date in the browser.
  const showOffer = isOfferLive(pricing.offer, new Date());

  return (
    <>
      <Hero />
      <TrustBar />
      <TrustLogos />
      {showOffer && <LimitedOffer />}
      {/* What we do → how it works → who does it → results → cost → reviews. The treatment
          quiz lives on the Services page; the stats are in the hero and the trust bar. */}
      <Services />
      <Process />
      <About />
      <BeforeAfterSlider />
      <CostEstimator />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
