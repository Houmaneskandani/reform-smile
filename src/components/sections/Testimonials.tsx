"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/content";

// Reviews are edited in content/testimonials.json (real reviews without the patient's
// permission on file are already left out by src/content/testimonials.ts). Sample (made-up)
// reviews are flagged isSample there, and the note below the grid shows while any of them is
// on the page. While every review shown is a sample, the note covers them all; once real
// reviews sit next to samples, each sample also gets an asterisk so the note points at it.
const reviews = testimonials.items.filter((review) => review.showOnHome);
const showSampleNote = reviews.some((review) => review.isSample);
const markEachSample = showSampleNote && reviews.some((review) => !review.isSample);

export default function Testimonials() {
  // No reviews to show (for example the samples were deleted before real ones exist): leave the
  // whole section out rather than show its heading over an empty grid.
  if (reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">
            Patient Stories
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-navy mb-6">
            Real Results, Real Smiles
          </h2>
          <p className="text-gray text-lg leading-relaxed">
            Hear from patients whose lives have been transformed by the
            Reform Smile team.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-cream rounded-2xl p-8 relative"
            >
              <Quote
                size={40}
                className="text-gold/20 absolute top-6 right-6"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-gold fill-gold"
                  />
                ))}
              </div>

              <p className="text-dark/80 leading-relaxed mb-6 text-sm">
                &ldquo;{review.quote}&rdquo;
              </p>

              <div className="border-t border-navy/10 pt-4">
                <p className="font-semibold text-navy">{review.displayName}</p>
                <p className="text-gold text-sm">
                  {review.treatmentLabel}
                  {markEachSample && review.isSample && " *"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note about placeholder content */}
        {showSampleNote && (
          <p className="text-center text-gray-light text-xs mt-8 italic">
            * Sample testimonials — will be replaced with real patient reviews
          </p>
        )}
      </div>
    </section>
  );
}
