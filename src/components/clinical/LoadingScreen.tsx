"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      if (p < 1) {
        requestAnimationFrame(animate);
      } else {
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
    <div className="fixed inset-0 z-[10000] bg-[#F5F0EB] flex items-center justify-center">
      <div className="w-48">
        <div className="h-px bg-[#E8E0D6] w-full relative overflow-hidden">
          <div
            className="h-full bg-[#C4A265] absolute top-0 left-0 origin-left"
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
            color: "#9A8E7E",
          }}
        >
          Loading
        </p>
      </div>
    </div>
  );
}
