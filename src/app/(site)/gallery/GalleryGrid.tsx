"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const cases = [
  { id: 1, title: "Full Arch Restoration", procedure: "All-on-4", before: "/images/cases/case-1-before.jpg", after: "/images/cases/case-1-after.jpg" },
  { id: 2, title: "Complete Smile Makeover", procedure: "All-on-6", before: "/images/cases/case-2-before.jpg", after: "/images/cases/case-2-after.jpg" },
  { id: 3, title: "Upper & Lower Restoration", procedure: "Full Arch", before: "/images/cases/case-3-before.jpg", after: "/images/cases/case-3-after.jpg" },
  { id: 4, title: "Single Arch Transformation", procedure: "All-on-4", before: "/images/cases/case-4-before.jpg", after: "/images/cases/case-4-after.jpg" },
  { id: 5, title: "Secure, Stable Dentures", procedure: "Snap-On Dentures", before: null, after: null },
  { id: 6, title: "Single Tooth Replacement", procedure: "Single Implant", before: null, after: null },
];

export default function GalleryGrid() {
  return (
    <section className="py-28 md:py-24 bg-white">
      <div className="section-container">
        {/* Keeps the heading order intact (h1 → h2 → h3) for screen readers. */}
        <h2 className="sr-only">Patient cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {cases.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl overflow-hidden shadow-md border border-gray-lighter hover:shadow-xl transition-shadow duration-300"
            >
              {/* Before / After side by side */}
              <div className="relative group">
                <div className="grid grid-cols-2 gap-px bg-gray-lighter">
                  <div className="relative aspect-[4/3] bg-cream overflow-hidden">
                    {item.before ? (
                      <Image src={item.before} alt={`${item.title} — before`} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                    ) : null}
                    <span className="absolute top-3 left-3 bg-navy/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] bg-cream-dark/30 overflow-hidden">
                    {item.after ? (
                      <Image src={item.after} alt={`${item.title} — after`} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                    ) : null}
                    <span className="absolute top-3 left-3 bg-gold text-navy-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      After
                    </span>
                  </div>
                </div>
                {/* Hover overlay */}
                <a
                  href="/book"
                  className="absolute inset-0 bg-navy/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="bg-gold text-navy font-semibold text-sm px-6 py-3 rounded-full tracking-wide hover:bg-gold/90 transition-colors">
                    Book an Appointment
                  </span>
                </a>
              </div>

              {/* Info */}
              <div className="p-6 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-lg text-navy">{item.title}</h3>
                  </div>
                  <span className="text-gold-ink text-sm font-semibold whitespace-nowrap">{item.procedure}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-gray-light text-xs mt-16 italic">
          * Before and after photos will be added as real patient cases become available.
          All placeholder content will be replaced with actual results.
        </p>
      </div>
    </section>
  );
}
