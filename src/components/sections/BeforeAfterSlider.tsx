"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

export function CompareSlider({
  beforeSrc,
  afterSrc,
  description,
}: {
  beforeSrc: string;
  afterSrc: string;
  /** What the two photos show, for people who can't see them. */
  description: string;
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
    const handleMove = (e: MouseEvent) => {
      if (isDragging.current) updatePosition(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) updatePosition(e.touches[0].clientX);
    };
    const handleUp = () => { isDragging.current = false; };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [updatePosition]);

  // Keyboard control of the divider (WCAG 2.1.1): arrows move it 5%, Page Up/Down 20%,
  // Home/End show only the after/before photo.
  const onKeyDown = (event: React.KeyboardEvent) => {
    const steps: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 };
    if (event.key in steps) setSliderPos((pos) => Math.max(2, Math.min(98, pos + steps[event.key])));
    else if (event.key === "Home") setSliderPos(2);
    else if (event.key === "End") setSliderPos(98);
    else return;
    event.preventDefault();
  };

  return (
    <div
      role="group"
      aria-label={description}
      ref={containerRef}
      className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-xl bg-cream"
      onMouseDown={() => { isDragging.current = true; }}
      onTouchStart={() => { isDragging.current = true; }}
    >
      {/* The photos are CSS backgrounds, so screen readers get the description above instead. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${afterSrc})` }}
        aria-hidden="true"
      />
      <span className="absolute top-4 right-4 z-20 bg-gold text-navy-dark text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
        After
      </span>

      {/* Before image — clipped by slider, also CSS background */}
      <div
        className="absolute top-0 left-0 bottom-0 overflow-hidden z-10"
        style={{ width: `${sliderPos}%` }}
      >
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${beforeSrc})`,
            width: `${(100 / sliderPos) * 100}%`,
          }}
        />
        <span className="absolute top-4 left-4 bg-navy/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Before
        </span>
      </div>

      {/* Slider handle: also a keyboard slider */}
      <div
        className="absolute top-0 bottom-0 z-20"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-0.5 h-full bg-white shadow-lg" aria-hidden="true" />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before and after divider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPos)}
          aria-valuetext={`${Math.round(sliderPos)}% before photo, ${100 - Math.round(sliderPos)}% after photo`}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold"
        >
          <svg aria-hidden="true" className="w-5 h-5 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterSlider() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-20"
        >
          <p className="text-gold-ink font-semibold tracking-widest uppercase text-sm mb-4">
            Our Work
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
            Real Patients, Real Results
          </h2>
          <p className="text-gray text-lg leading-relaxed">
            Drag the slider, or use the arrow keys, to see the transformation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <CompareSlider
            beforeSrc="/images/cases/veneers-before.webp"
            afterSrc="/images/cases/veneers-after.webp"
            description="Close-up of the same patient's upper front teeth: before porcelain veneers, uneven in color and shape; after, even and uniformly white"
          />
          <p className="text-center mt-6 text-navy font-heading text-xl">Dental Veneers</p>
          <p className="text-center text-gray text-sm mt-1">Same patient — before and after porcelain veneers</p>
        </motion.div>
      </div>
    </section>
  );
}
