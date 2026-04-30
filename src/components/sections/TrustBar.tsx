"use client";

import { motion } from "framer-motion";
import { Shield, Award, Clock, Heart } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Board Certified",
    description: "Licensed DDS with advanced implant training",
  },
  {
    icon: Award,
    title: "500+ Implants Placed",
    description: "Proven expertise you can trust",
  },
  {
    icon: Clock,
    title: "Same-Day Smiles",
    description: "Walk out with new teeth in one visit",
  },
  {
    icon: Heart,
    title: "Patient-First Care",
    description: "Compassionate, personalized treatment",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-cream border-y border-cream-dark">
      <div className="section-container py-14 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-5">
                <item.icon size={28} className="text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-navy text-base mb-2">
                {item.title}
              </h3>
              <p className="text-gray text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
