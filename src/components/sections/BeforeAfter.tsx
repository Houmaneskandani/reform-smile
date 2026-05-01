"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

const cases = [
  {
    id: 1,
    title: "Full Arch Restoration",
    procedure: "All-on-X Implants",
    image: "/images/cases/case-1-full-arch.jpg",
    description: "Complete upper and lower arch restoration with implant-supported prosthetics.",
  },
  {
    id: 2,
    title: "Dental Veneers",
    procedure: "Porcelain Veneers",
    image: "/images/cases/case-2-before-after.jpg",
    description: "Natural-looking veneer transformation — before and after comparison.",
  },
  {
    id: 3,
    title: "Single Implant Placement",
    procedure: "Dental Implant",
    image: "/images/cases/case-3-implant-placement.jpg",
    description: "Precision implant placement with immediate aesthetic results.",
  },
  {
    id: 4,
    title: "Full Arch Prosthetic",
    procedure: "All-on-X Implants",
    image: "/images/cases/case-4-prosthetic.jpg",
    description: "Premium zirconia prosthetic — natural translucency and strength.",
  },
];

export default function BeforeAfter() {
  return (
    <section className="py-16 md:py-36 bg-white">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-20"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            Our Work
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
            Real Patients, Real Results
          </h2>
          <p className="text-gray text-lg leading-relaxed">
            See the life-changing transformations achieved by Dr. Pournejad.
          </p>
        </motion.div>

        {/* Large 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-lighter"
            >
              {/* Image — large */}
              <div className="aspect-[16/10] overflow-hidden bg-navy/5">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl text-navy mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray text-sm">{item.description}</p>
                  </div>
                  <span className="text-gold text-sm font-semibold whitespace-nowrap">
                    {item.procedure}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-16"
        >
          <Button href="/gallery" variant="primary" size="lg">
            View Full Gallery
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
