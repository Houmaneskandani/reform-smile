"use client";

import { motion } from "framer-motion";
import { Crosshair, Layers, Clock, Bone, Stethoscope, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

const services = [
  {
    icon: Crosshair,
    title: "All-on-4 Dental Implants",
    description:
      "A full arch of permanent teeth supported by just four strategically placed implants. Restore your complete smile in a single day.",
  },
  {
    icon: Layers,
    title: "All-on-6 Dental Implants",
    description:
      "Six implants provide enhanced stability and support for a complete arch, ideal for patients who need extra strength and durability.",
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
    icon: Stethoscope,
    title: "Full Mouth Reconstruction",
    description:
      "Comprehensive restoration combining implants, prosthetics, and advanced techniques to rebuild your entire smile.",
  },
  {
    icon: ArrowRight,
    title: "Free Consultation",
    description:
      "Meet Dr. Pournejad for a comprehensive evaluation with 3D imaging and receive a personalized treatment plan — no cost to you.",
  },
];

export default function Services() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-20"
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

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group bg-white rounded-2xl p-8 lg:p-10 border border-gray-lighter hover:border-gold/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-cream flex items-center justify-center mb-7 group-hover:bg-gold/10 transition-colors duration-300">
                <service.icon
                  size={26}
                  className="text-navy group-hover:text-gold transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-heading text-xl text-navy mb-4 leading-snug">
                {service.title}
              </h3>
              <p className="text-gray text-[15px] leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-20"
        >
          <Button href="/services" variant="primary" size="lg">
            View All Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
