"use client";

import { motion } from "framer-motion";
import { CompareSlider } from "@/components/sections/BeforeAfterSlider";

const cases = [
  { id: 1, title: "Full Arch Restoration", before: "/images/cases/case-1-before.jpg", after: "/images/cases/case-1-after.jpg" },
  { id: 2, title: "Complete Smile Makeover", before: "/images/cases/case-2-before.jpg", after: "/images/cases/case-2-after.jpg" },
  { id: 3, title: "Upper & Lower Restoration", before: "/images/cases/case-3-before.jpg", after: "/images/cases/case-3-after.jpg" },
  { id: 4, title: "Single Arch Transformation", before: "/images/cases/case-4-before.jpg", after: "/images/cases/case-4-after.jpg" },
  { id: 5, title: "Full Arch Implants Transformation", before: "/images/cases/case-5-before.jpg", after: "/images/cases/case-5-after.jpg" },
  { id: 6, title: "Single Tooth Replacement", before: "/images/cases/case-6-before.jpg", after: "/images/cases/case-6-after.jpg" },
  { id: 7, title: "Full Mouth Rehabilitation", before: "/images/cases/case-7-before.jpg", after: "/images/cases/case-7-after.jpg" },
];

export default function GalleryGrid() {
  return (
    <section className="py-28 md:py-24 bg-white">
      <div className="section-container">
        <h2 className="sr-only">Patient cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {cases.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              {item.before && item.after ? (
                <CompareSlider
                  beforeSrc={item.before}
                  afterSrc={item.after}
                  description={item.title}
                />
              ) : (
                <div className="aspect-[16/9] rounded-2xl bg-cream flex items-center justify-center shadow-md border border-gray-lighter">
                  <p className="text-navy/30 text-sm">Photo coming soon</p>
                </div>
              )}
              <p className="mt-4 font-heading text-lg text-navy text-center">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
