"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
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
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) updatePosition(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) updatePosition(e.touches[0].clientX);
    };
    const handleUp = () => { isDragging.current = false; };

    // Listen on window so dragging doesn't stop at image edges
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [updatePosition]);

  const handleDown = () => { isDragging.current = true; };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-lg"
      onMouseDown={handleDown}
      onTouchStart={handleDown}
    >
      {/* After image — full background */}
      <Image src={afterSrc} alt={`${title} — After`} fill className="object-cover" />
      <span className="absolute top-4 right-4 z-20 bg-gold text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
        After
      </span>

      {/* Before image — clipped by slider */}
      <div
        className="absolute top-0 left-0 bottom-0 overflow-hidden z-10"
        style={{ width: `${sliderPos}%` }}
      >
        <Image
          src={beforeSrc}
          alt={`${title} — Before`}
          fill
          className="object-cover"
          style={{ maxWidth: "none", width: `${containerRef.current?.offsetWidth || 9999}px` }}
        />
        <span className="absolute top-4 left-4 bg-navy/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Before
        </span>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-20"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-0.5 h-full bg-white shadow-lg" />
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
            Drag the slider to see the transformation.
          </p>
        </motion.div>

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
              beforeSrc="/images/cases/implant-before.jpg"
              afterSrc="/images/cases/implant-after.jpg"
              title="Full Arch Implants"
            />
            <p className="text-center mt-4 text-navy font-heading text-lg">Full Arch Implants</p>
            <p className="text-center text-gray text-sm">Complete smile transformation with dental implants</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
