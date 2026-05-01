"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, Users } from "lucide-react";
import Button from "@/components/ui/Button";

const credentials = [
  { icon: GraduationCap, label: "Doctor of Dental Surgery" },
  { icon: Award, label: "Advanced Implant Training" },
  { icon: Users, label: "500+ Implants Placed" },
];

export default function About() {
  return (
    <section className="py-16 md:py-36 bg-cream">
      <div className="section-container">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-20 items-center">
          {/* Image — takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              <div className="aspect-[3/4] rounded-2xl bg-white overflow-hidden shadow-lg">
                {/* TODO: Replace with Dr. Ava's professional photo */}
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-cream to-white">
                  <div className="w-28 h-28 rounded-full bg-gold/15 mb-6 flex items-center justify-center">
                    <span className="text-gold text-4xl font-heading">A</span>
                  </div>
                  <p className="text-navy/40 text-sm text-center">
                    Dr. Pournejad&apos;s Photo
                  </p>
                  <p className="text-navy/25 text-xs mt-1">(Placeholder)</p>
                </div>
              </div>
              {/* Gold accent */}
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-gold/30 rounded-2xl -z-10" />
            </div>
          </motion.div>

          {/* Content — takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
              Meet Your Doctor
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-8 leading-tight">
              Dr. Ava Pournejad, DDS
            </h2>
            <p className="text-gray text-[17px] leading-relaxed mb-6">
              Dr. Pournejad is passionate about transforming lives through
              advanced dental implant solutions. With extensive training in full arch
              restorations and All-on-X procedures, she combines clinical expertise
              with a compassionate, patient-first approach.
            </p>
            <p className="text-gray text-[17px] leading-relaxed mb-10">
              At Reform Smile & Dental Implant Center, every treatment plan is
              personalized. Dr. Pournejad believes that everyone deserves a
              confident, beautiful smile — and she&apos;s dedicated to making that
              a reality with the latest technology and techniques.
            </p>

            {/* Credentials */}
            <div className="space-y-5 mb-10">
              {credentials.map((cred) => (
                <div key={cred.label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <cred.icon size={20} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <span className="text-navy font-medium text-[15px]">{cred.label}</span>
                </div>
              ))}
            </div>

            <Button href="/about" variant="primary" size="md">
              Learn More About Dr. Pournejad
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
