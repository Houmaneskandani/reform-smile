"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, Sparkles, Clock, Bone, Stethoscope, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useRef, useState } from "react";

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

// Short labels for pills
const pillLabels = ["Full Arch", "Single", "Veneers", "Same-Day", "Bone Graft", "Consult"];

function MobileServiceTabs() {
  const [active, setActive] = useState(0);
  const service = services[active];

  return (
    <div className="md:hidden">
      {/* Scrollable pill bar */}
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
        {services.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
              active === i
                ? "bg-navy text-white shadow-md"
                : "bg-cream text-navy/60 hover:bg-cream-dark"
            }`}
          >
            {pillLabels[i]}
          </button>
        ))}
      </div>

      {/* Active service card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-cream/50 rounded-2xl p-6 mt-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
            <service.icon size={24} className="text-gold" strokeWidth={1.5} />
          </div>
          <h3 className="font-heading text-xl text-navy mb-3">
            {service.title}
          </h3>
          <p className="text-gray text-[14px] leading-relaxed mb-4">
            {service.description}
          </p>
          <span className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold">
            Learn More
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
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

        {/* Mobile — tab pills */}
        <MobileServiceTabs />

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
