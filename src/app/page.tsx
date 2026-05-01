import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import TrustLogos from "@/components/sections/TrustLogos";
import Services from "@/components/sections/Services";
import StatsCounter from "@/components/sections/StatsCounter";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <TrustLogos />
      <Services />
      <StatsCounter />
      <BeforeAfter />
      <Process />
      <About />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
