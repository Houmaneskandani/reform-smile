"use client";

import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import Image from "next/image";

function CompareSlider({
  beforeSrc,
  afterSrc,
  title,
}: {
  beforeSrc: string;
  afterSrc: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) updatePosition(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-lg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* After image — full width behind */}
      <div className="absolute inset-0">
        <Image src={afterSrc} alt={`${title} — After`} fill className="object-cover" />
        <span className="absolute top-4 right-4 bg-gold text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          After
        </span>
      </div>

      {/* Before image — clipped by slider position */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <div className="relative w-full h-full" style={{ width: `${containerRef.current?.offsetWidth || 1000}px` }}>
          <Image src={beforeSrc} alt={`${title} — Before`} fill className="object-cover" />
        </div>
        <span className="absolute top-4 left-4 bg-navy/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Before
        </span>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        {/* Vertical line */}
        <div className="w-0.5 h-full bg-white shadow-lg" />

        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterSlider() {
  return (
    <section className="py-16 md:py-36 bg-white">
      <div className="section-container">
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
            Drag the slider to see the transformation. These results speak for themselves.
          </p>
        </motion.div>

        {/* Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CompareSlider
              beforeSrc="/images/cases/veneers-before.jpg"
              afterSrc="/images/cases/veneers-after.jpg"
              title="Dental Veneers"
            />
            <p className="text-center mt-4 text-navy font-heading text-lg">Dental Veneers</p>
            <p className="text-center text-gray text-sm">Same patient — before and after porcelain veneers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CompareSlider
              beforeSrc="/images/cases/case-3-implant-placement.jpg"
              afterSrc="/images/cases/case-4-prosthetic.jpg"
              title="Full Arch Implants"
            />
            <p className="text-center mt-4 text-navy font-heading text-lg">Full Arch Implants</p>
            <p className="text-center text-gray text-sm">From implant placement to final prosthetic</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
