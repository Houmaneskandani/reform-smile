"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia("(max-width: 768px)").matches) return;

    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [role='button']")) {
        setHovering(true);
        // Snap to link center
        const rect = el.closest("a, button, [role='button']")!.getBoundingClientRect();
        target.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      } else {
        setHovering(false);
      }
    };

    let raf: number;
    const animate = () => {
      // Linear interpolation — sharp, not loose
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
      style={{ willChange: "transform" }}
    >
      {/* Crosshair cursor */}
      <div
        className={`relative transition-transform duration-100 ${
          hovering ? "scale-150" : "scale-100"
        }`}
        style={{ marginLeft: "-12px", marginTop: "-12px" }}
      >
        {/* Horizontal line */}
        <div
          className="absolute top-[11px] left-0 w-[24px] h-px"
          style={{ backgroundColor: "#00b8c4" }}
        />
        {/* Vertical line */}
        <div
          className="absolute top-0 left-[11px] w-px h-[24px]"
          style={{ backgroundColor: "#00b8c4" }}
        />
        {/* Center dot on hover */}
        {hovering && (
          <div
            className="absolute top-[9px] left-[9px] w-[5px] h-[5px] rounded-full"
            style={{ backgroundColor: "#00b8c4" }}
          />
        )}
      </div>
    </div>
  );
}
