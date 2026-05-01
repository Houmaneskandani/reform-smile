"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedNumber({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 500, suffix: "+", label: "Successful Implants", detail: "Procedures performed" },
  { value: 5, suffix: ".0", label: "Patient Rating", detail: "Based on reviews" },
  { value: 98, suffix: "%", label: "Success Rate", detail: "Long-term outcomes" },
  { value: 1, suffix: " Day", label: "Same-Day Smiles", detail: "Teeth-in-a-Day" },
];

export default function StatsCounter() {
  return (
    <section className="py-20 md:py-24 bg-navy relative overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-gold/5 blur-[80px]" />
      </div>

      <div className="relative section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-gold text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-3">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-white text-sm md:text-base font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-white/30 text-xs">
                {stat.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
