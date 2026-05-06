"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, Users } from "lucide-react";
import Image from "next/image";
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
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/dr-ava.jpg"
                  alt="Dr. Ava, DDS — Reform Smile & Dental Implant Center"
                  width={400}
                  height={533}
                  className="w-full h-full object-cover object-top"
                  priority
                />
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
              Meet Your Doctor
            </h2>
            <p className="text-gray text-[17px] leading-relaxed mb-6">
              Our doctor is passionate about transforming lives through
              advanced dental implant solutions. With extensive training in full arch
              restorations, All-on-X procedures, and cosmetic dentistry, she combines clinical expertise
              with a compassionate, patient-first approach.
            </p>
            <p className="text-gray text-[17px] leading-relaxed mb-10">
              At Reform Smile & Dental Implant Center, every treatment plan is
              personalized. We believe that everyone deserves a
              confident, beautiful smile — and we&apos;re dedicated to making that
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
              Learn More About Our Doctor
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
