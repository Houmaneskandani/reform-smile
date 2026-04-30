"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    text: "Dr. Pournejad gave me my life back. I had been hiding my smile for years because of missing teeth. After my All-on-4 procedure, I can't stop smiling. The entire team made me feel comfortable and cared for.",
    procedure: "All-on-4 Dental Implants",
    rating: 5,
  },
  {
    name: "James R.",
    text: "I visited multiple dentists before finding Reform Smile. Dr. Pournejad took the time to explain everything and created a plan that worked for me. The results exceeded my expectations — my new teeth look completely natural.",
    procedure: "Full Arch Restoration",
    rating: 5,
  },
  {
    name: "Maria L.",
    text: "I was terrified of dental procedures, but Dr. Pournejad and her team were incredibly patient and gentle. The Teeth-in-a-Day procedure was smoother than I ever imagined. I walked out with a brand new smile!",
    procedure: "Teeth-in-a-Day",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-36 bg-white">
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
            Hear from patients whose lives have been transformed by
            Dr. Pournejad and the Reform Smile team.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
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
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-gold fill-gold"
                  />
                ))}
              </div>

              <p className="text-dark/80 leading-relaxed mb-6 text-sm">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="border-t border-navy/10 pt-4">
                <p className="font-semibold text-navy">{testimonial.name}</p>
                <p className="text-gold text-sm">{testimonial.procedure}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note about placeholder content */}
        <p className="text-center text-gray-light text-xs mt-8 italic">
          * Sample testimonials — will be replaced with real patient reviews
        </p>
      </div>
    </section>
  );
}
