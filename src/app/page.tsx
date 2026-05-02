import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import TrustLogos from "@/components/sections/TrustLogos";
import Services from "@/components/sections/Services";
import SmileQuiz from "@/components/sections/SmileQuiz";
import StatsCounter from "@/components/sections/StatsCounter";
import BeforeAfterSlider from "@/components/sections/BeforeAfterSlider";
import CostEstimator from "@/components/sections/CostEstimator";
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
      <SmileQuiz />
      <StatsCounter />
      <BeforeAfterSlider />
      <CostEstimator />
      <Process />
      <About />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
