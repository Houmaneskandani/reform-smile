"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Search, ScanLine, Wrench, Smile } from "lucide-react";
import { useRef } from "react";

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

function TiltCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group cursor-default"
    >
      {children}
    </motion.div>
  );
}

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
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
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

        {/* Connecting line — desktop only */}
        <div className="hidden lg:block absolute top-[58%] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <TiltCard key={step.number} index={index}>
              <div className="text-center bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.06] hover:border-gold/15 transition-all duration-500 relative">
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-gold/[0.04] to-transparent skew-x-[-20deg]" />
                </div>

                {/* Number */}
                <span className="text-gold/10 text-6xl font-heading font-bold block mb-4">
                  {step.number}
                </span>

                {/* Icon with glow */}
                <div className="relative w-16 h-16 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/10 group-hover:border-gold/20 transition-all duration-500">
                  <motion.div
                    whileInView={{ rotate: [0, -8, 8, -4, 0] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                  >
                    <step.icon size={28} className="text-gold" strokeWidth={1.5} />
                  </motion.div>

                  {/* Glow behind icon on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gold/0 group-hover:bg-gold/5 blur-xl transition-all duration-500" />
                </div>

                <h3 className="font-heading text-xl text-white mb-3 group-hover:text-gold transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-white/40 group-hover:text-white/60 text-[14px] leading-relaxed max-w-[240px] mx-auto transition-colors duration-300">
                  {step.description}
                </p>

                {/* Step indicator dot */}
                <div className="hidden lg:flex justify-center mt-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold/20 group-hover:bg-gold/60 transition-colors duration-300" />
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
