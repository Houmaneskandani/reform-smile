"use client";

import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { useState } from "react";

const videos = [
  {
    id: 1,
    name: "Sarah M.",
    procedure: "All-on-4 Implants",
    quote: "I can eat anything I want now. Dr. Pournejad gave me my life back.",
  },
  {
    id: 2,
    name: "James R.",
    procedure: "Full Arch Restoration",
    quote: "I went from hiding my smile to showing it off every single day.",
  },
  {
    id: 3,
    name: "Maria L.",
    procedure: "Teeth-in-a-Day",
    quote: "The whole process was easier than I ever imagined. Incredible team.",
  },
  {
    id: 4,
    name: "Robert K.",
    procedure: "All-on-6 Implants",
    quote: "My only regret is not doing this sooner. Life-changing results.",
  },
];

export default function VideoTestimonials() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <section className="py-28 md:py-36 bg-gray-lighter">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            Patient Testimonials
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
            Hear From Our Patients
          </h2>
          <p className="text-gray text-lg leading-relaxed">
            Nothing tells our story better than the words of our patients.
            Watch their journeys and see the results for yourself.
          </p>
        </motion.div>

        {/* Video Grid — 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Video thumbnail */}
              <div
                className="relative aspect-video rounded-2xl overflow-hidden bg-navy/5 cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300"
                onClick={() => setActiveVideo(video.id)}
              >
                {/* TODO: Replace with real video thumbnails */}
                <div className="w-full h-full bg-gradient-to-br from-cream to-cream-dark" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gold/90 group-hover:bg-gold flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <Play size={24} className="text-white ml-1" fill="white" />
                  </div>
                </div>

                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="flex gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-white font-semibold text-sm">{video.name}</p>
                  <p className="text-white/70 text-xs">{video.procedure}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-dark/60 text-sm italic mt-4 px-1">
                &ldquo;{video.quote}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-gray-light text-xs mt-12 italic">
          * Sample testimonials — will be replaced with real patient videos
        </p>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-4xl aspect-video bg-navy-dark rounded-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Play size={56} className="text-gold mx-auto mb-4" />
                <p className="text-white text-lg">Patient Testimonial Video</p>
                <p className="text-white/50 text-sm mt-2">Video will be embedded here</p>
              </div>
            </div>
            <button onClick={() => setActiveVideo(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer" aria-label="Close">
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
