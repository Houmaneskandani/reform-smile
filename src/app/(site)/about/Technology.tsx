"use client";

import { motion } from "framer-motion";
import { Monitor, ScanLine, Cpu, ShieldCheck } from "lucide-react";

const tech = [
  {
    icon: ScanLine,
    title: "3D CT Scanning",
    description: "Detailed 3D images of your jaw structure for precise diagnosis and treatment planning.",
  },
  {
    icon: Monitor,
    title: "Digital Treatment Planning",
    description: "Computer-guided implant placement for predictable, accurate results every time.",
  },
  {
    icon: Cpu,
    title: "Guided Implant Surgery",
    description: "Custom surgical guides ensure each implant is placed at the exact angle and depth for optimal results.",
  },
  {
    icon: ShieldCheck,
    title: "Premium Materials",
    description: "We use only the highest-quality implants and prosthetics from trusted, proven manufacturers.",
  },
];

export default function Technology() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            Our Technology
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
            State-of-the-Art Equipment
          </h2>
          <p className="text-gray text-lg leading-relaxed">
            We invest in advanced technology to ensure every procedure is as
            precise, comfortable, and successful as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {tech.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-cream rounded-2xl p-10"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                <item.icon size={28} className="text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl text-navy mb-3">{item.title}</h3>
              <p className="text-gray text-[15px] leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
