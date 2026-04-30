"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    procedure: "All-on-4 Patient",
    stars: 5,
    text: "Dr. Pournejad gave me my life back. After years of hiding my smile, I can finally laugh without covering my mouth. The whole experience was incredible.",
  },
  {
    name: "James R.",
    procedure: "Full Arch Restoration",
    stars: 5,
    text: "I visited five dentists before finding Reform Smile. Dr. Pournejad was the only one who took the time to truly understand what I needed. The results speak for themselves.",
  },
  {
    name: "Maria L.",
    procedure: "Teeth-in-a-Day",
    stars: 5,
    text: "I was terrified of dental work my entire life. The team at Reform Smile made me feel completely at ease. I walked out the same day with a brand new smile.",
  },
  {
    name: "Robert K.",
    procedure: "All-on-6 Patient",
    stars: 5,
    text: "My only regret is not doing this sooner. I spent years with uncomfortable dentures. Now I have permanent teeth that look and feel completely natural.",
  },
  {
    name: "Linda T.",
    procedure: "Full Mouth Reconstruction",
    stars: 5,
    text: "From the first consultation to the final result, everything was handled with such care and precision. Dr. Pournejad is truly an artist. I smile every single day now.",
  },
];

export default function ScrollContent() {
  return (
    <div className="relative z-20 section-container">
      <div className="max-w-md py-20">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <span
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{
              fontFamily: '"JetBrains Mono", "SF Mono", monospace',
              color: "#C4A265",
            }}
          >
            Patient Stories
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Review cards — stack naturally */}
        <div className="space-y-12">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.07] transition-colors duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(review.stars)].map((_, j) => (
                  <Star key={j} size={13} className="text-[#C4A265] fill-[#C4A265]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/60 text-[15px] leading-relaxed mb-6">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C4A265]/15 flex items-center justify-center">
                  <span className="text-[#C4A265] text-xs font-semibold">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">{review.name}</p>
                  <p
                    className="text-[10px] tracking-[0.15em] uppercase"
                    style={{
                      fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                      color: "#C4A265",
                      opacity: 0.6,
                    }}
                  >
                    {review.procedure}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/15 text-[10px] mt-10 italic">
          * Sample reviews — will be replaced with real patient testimonials
        </p>
      </div>
    </div>
  );
}
