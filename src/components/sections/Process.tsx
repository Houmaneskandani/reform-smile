"use client";

import { motion } from "framer-motion";
import { Search, ScanLine, Wrench, Smile } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Free Consultation",
    description:
      "Comprehensive exam, 3D CT scan, and detailed evaluation — completely free of charge.",
  },
  {
    number: "02",
    icon: ScanLine,
    title: "Custom Treatment Plan",
    description:
      "A personalized plan designed for your needs, with full cost breakdown and financing options.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Implant Procedure",
    description:
      "Precise, comfortable placement using advanced 3D-guided technology — often in a single visit.",
  },
  {
    number: "04",
    icon: Smile,
    title: "Your New Smile",
    description:
      "Walk out with beautiful, permanent teeth. Enjoy eating, laughing, and living with confidence.",
  },
];

export default function Process() {
  return (
    <section className="py-16 md:py-36 bg-navy relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            How It Works
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 leading-tight">
            Your Journey to a <span className="text-gold">New Smile</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            From your first consultation to your brand new smile — here&apos;s
            what to expect when you choose Reform Smile.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center"
            >
              {/* Number */}
              <span className="text-gold/15 text-7xl font-heading font-bold block mb-6">
                {step.number}
              </span>

              {/* Icon — animated on hover */}
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-7 group-hover:bg-gold/10 group-hover:border-gold/20 transition-all duration-500 relative">
                <motion.div
                  whileInView={{ rotate: [0, -10, 10, -5, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                >
                  <step.icon size={32} className="text-gold" strokeWidth={1.5} />
                </motion.div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-2xl border border-gold/10 animate-ping opacity-0 group-hover:opacity-20" style={{ animationDuration: "2s" }} />
              </div>

              <h3 className="font-heading text-xl text-white mb-4">
                {step.title}
              </h3>
              <p className="text-white/50 text-[15px] leading-relaxed max-w-[260px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
