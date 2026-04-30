import HeroV2 from "@/components/sections/HeroV2";
import TrustBar from "@/components/sections/TrustBar";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import BeforeAfter from "@/components/sections/BeforeAfter";
import About from "@/components/sections/About";
import VideoTestimonials from "@/components/sections/VideoTestimonials";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroV2 />
      <TrustBar />
      <Services />
      <Process />
      <BeforeAfter />
      <About />
      <VideoTestimonials />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
