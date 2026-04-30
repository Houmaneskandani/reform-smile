"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress — thin line fills left to right
    const duration = 1800; // ms
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      if (p < 1) {
        requestAnimationFrame(animate);
      } else {
        // Fade out
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-[#f4f5f7] flex items-center justify-center">
      <div className="w-48">
        {/* Progress line — thin, precise */}
        <div className="h-px bg-[#e0e2e6] w-full relative overflow-hidden">
          <div
            className="h-full bg-[#00b8c4] absolute top-0 left-0 origin-left"
            style={{
              width: `${progress * 100}%`,
              transition: "width 50ms linear",
            }}
          />
        </div>
        <p
          className="text-center mt-4 text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: '"JetBrains Mono", "SF Mono", monospace',
            color: "#b0b3b8",
          }}
        >
          Loading
        </p>
      </div>
    </div>
  );
}
