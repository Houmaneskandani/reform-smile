"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

const cases = [
  {
    id: 1,
    title: "Full Arch Restoration",
    procedure: "All-on-4",
  },
  {
    id: 2,
    title: "Complete Smile Makeover",
    procedure: "All-on-6",
  },
  {
    id: 3,
    title: "Upper & Lower Restoration",
    procedure: "Full Mouth",
  },
];

export default function BeforeAfter() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            Smile Gallery
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
            Real Patients, Real Results
          </h2>
          <p className="text-gray text-lg leading-relaxed">
            See the life-changing transformations achieved by Dr. Pournejad.
          </p>
        </motion.div>

        {/* Compact Before/After Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-lighter"
            >
              {/* Before/After images side by side */}
              <div className="grid grid-cols-2 gap-px bg-gray-lighter">
                {/* Before */}
                <div className="relative aspect-[4/3] bg-cream">
                  {/* TODO: Replace with real before photo */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-navy/20 text-sm">Before</span>
                  </div>
                  <span className="absolute top-3 left-3 bg-navy/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Before
                  </span>
                </div>

                {/* After */}
                <div className="relative aspect-[4/3] bg-cream-dark/30">
                  {/* TODO: Replace with real after photo */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gold-dark/20 text-sm">After</span>
                  </div>
                  <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    After
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-heading text-lg text-navy mb-1">
                  {item.title}
                </h3>
                <p className="text-gold text-sm font-medium">
                  {item.procedure}
                </p>
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
            View Full Smile Gallery
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
