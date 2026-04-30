"use client";

import { motion } from "framer-motion";

const cases = [
  { id: 1, title: "Full Arch Restoration", procedure: "All-on-4", description: "Patient with multiple missing upper teeth restored with permanent implants." },
  { id: 2, title: "Complete Smile Makeover", procedure: "All-on-6", description: "Severely worn teeth replaced with natural-looking implant prosthetics." },
  { id: 3, title: "Upper & Lower Restoration", procedure: "Full Mouth", description: "Complete upper and lower arch restoration for a brand new smile." },
  { id: 4, title: "Single Arch Transformation", procedure: "All-on-4", description: "Lower arch restored with four implants and a permanent prosthetic." },
  { id: 5, title: "Bone Graft + Implants", procedure: "Bone Grafting", description: "Bone regeneration followed by full arch implant placement." },
  { id: 6, title: "Teeth-in-a-Day Case", procedure: "Teeth-in-a-Day", description: "Complete smile transformation completed in a single appointment." },
];

export default function GalleryGrid() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="section-container">
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
              <div className="grid grid-cols-2 gap-px bg-gray-lighter">
                <div className="relative aspect-[4/3] bg-cream">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-navy/20 text-sm">Before</span>
                  </div>
                  <span className="absolute top-3 left-3 bg-navy/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Before
                  </span>
                </div>
                <div className="relative aspect-[4/3] bg-cream-dark/30">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gold-dark/20 text-sm">After</span>
                  </div>
                  <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    After
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-lg text-navy mb-1">{item.title}</h3>
                    <p className="text-gray text-sm">{item.description}</p>
                  </div>
                  <span className="text-gold text-sm font-semibold whitespace-nowrap">{item.procedure}</span>
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
