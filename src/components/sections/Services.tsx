"use client";

import { motion, useInView } from "framer-motion";
import { Crosshair, Sparkles, Clock, Bone, Stethoscope, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useRef } from "react";

const services = [
  {
    icon: Crosshair,
    title: "Full Arch Dental Implants",
    description:
      "Complete smile restoration using the All-on-X technique. 4-6 strategically placed implants support an entire arch of permanent, beautiful teeth.",
  },
  {
    icon: Stethoscope,
    title: "Single Dental Implants",
    description:
      "Replace individual missing teeth with a titanium implant post and custom crown — looks and feels exactly like your natural tooth.",
  },
  {
    icon: Sparkles,
    title: "Dental Veneers",
    description:
      "Ultra-thin porcelain shells that transform the appearance of your teeth. Fix chips, stains, gaps, and uneven teeth for a flawless smile.",
  },
  {
    icon: Clock,
    title: "Teeth-in-a-Day",
    description:
      "Walk in with missing or failing teeth and walk out the same day with a brand new, beautiful smile. Life-changing results, fast.",
  },
  {
    icon: Bone,
    title: "Bone Grafting",
    description:
      "Advanced bone regeneration to build a strong foundation for implants, even when significant bone loss has occurred.",
  },
  {
    icon: ArrowRight,
    title: "Free Consultation",
    description:
      "Meet Dr. Pournejad for a comprehensive evaluation with 3D imaging and receive a personalized treatment plan — no cost to you.",
  },
];

// Mobile card that expands on scroll
function MobileServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-gray-lighter last:border-0"
    >
      <div className={`py-5 px-4 transition-all duration-500 ${isInView ? "bg-white rounded-xl shadow-sm my-2" : ""}`}>
        {/* Always visible: icon + title row */}
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isInView ? "bg-gold/10" : "bg-cream"}`}>
            <service.icon
              size={22}
              className={`transition-colors duration-500 ${isInView ? "text-gold" : "text-navy"}`}
              strokeWidth={1.5}
            />
          </div>
          <h3 className="font-heading text-lg text-navy leading-snug">
            {service.title}
          </h3>
        </div>

        {/* Expands on scroll into view */}
        <div className={`overflow-hidden transition-all duration-500 ease-out ${isInView ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}>
          <p className="text-gray text-[14px] leading-relaxed pl-15 ml-15">
            {service.description}
          </p>
          <span className={`inline-flex items-center gap-1.5 text-gold text-sm font-semibold mt-3 ml-15 transition-all duration-300 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
            Learn More
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section className="py-16 md:py-36 bg-white">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-20"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            Our Services
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
            Advanced Implant Solutions
          </h2>
          <p className="text-gray text-lg leading-relaxed">
            We specialize in full arch dental implants using the latest
            technology and techniques to deliver permanent, natural-looking
            results that transform lives.
          </p>
        </motion.div>

        {/* Desktop grid — unchanged */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group bg-white rounded-2xl p-8 lg:p-10 border border-gray-lighter hover:border-gold/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/[0.02] group-hover:to-gold/[0.06] transition-all duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-cream flex items-center justify-center mb-7 group-hover:bg-gold/10 transition-colors duration-300">
                  <service.icon size={26} className="text-navy group-hover:text-gold transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl text-navy mb-4 leading-snug">{service.title}</h3>
                <p className="text-gray text-[15px] leading-relaxed mb-4">{service.description}</p>
                <span className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Learn More
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile — expandable cards on scroll */}
        <div className="md:hidden">
          {services.map((service, index) => (
            <MobileServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12 md:mt-20"
        >
          <Button href="/services" variant="primary" size="lg">
            View All Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
