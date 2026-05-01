"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";

const services = [
  {
    id: "full-arch",
    title: "Full Arch Dental Implants",
    tagline: "Main Service — Complete Smile Restoration",
    image: "/images/cases/case-4-prosthetic.jpg",
    image2: "/images/cases/case-1-full-arch.jpg",
    description: [
      "Full arch dental implants are the gold standard for replacing a complete set of teeth. Using the All-on-X technique, Dr. Pournejad places 4-6 strategically positioned implants to support an entire arch of beautiful, permanent teeth.",
      "This approach delivers stunning, natural-looking results — often in a single visit. No more dentures, no more adhesives. Just a confident, permanent smile you can eat, laugh, and live with.",
    ],
    benefits: [
      "Full arch of permanent teeth in one visit",
      "No denture adhesives — ever",
      "Eat, smile, and laugh with total confidence",
      "Minimal bone grafting required",
      "Natural look and feel",
      "Long-lasting, durable results",
    ],
  },
  {
    id: "single-implants",
    title: "Single Dental Implants",
    tagline: "Replace Individual Missing Teeth",
    image: "/images/cases/case-3-implant-placement.jpg",
    description: [
      "A single dental implant is the ideal solution for replacing one missing tooth without affecting neighboring teeth. A titanium implant post is placed directly into the jawbone, acting as an artificial root, then topped with a custom-crafted crown.",
      "The result is indistinguishable from your natural teeth — in look, feel, and function. Single implants also preserve bone structure and prevent the shifting of surrounding teeth.",
    ],
    benefits: [
      "Replaces one tooth without affecting others",
      "Looks and feels like a natural tooth",
      "Preserves jawbone structure",
      "Prevents neighboring teeth from shifting",
      "Easy to care for — brush and floss normally",
    ],
  },
  {
    id: "veneers",
    title: "Dental Veneers",
    tagline: "Transform Your Smile's Appearance",
    image: "/images/cases/case-2-before-after.jpg",
    description: [
      "Dental veneers are ultra-thin, custom-made shells that cover the front surface of your teeth to improve their appearance. They're an excellent solution for teeth that are discolored, chipped, worn, misaligned, or unevenly spaced.",
      "Dr. Pournejad uses premium porcelain veneers that are designed to match the natural translucency and color of real teeth. The result is a flawless, natural-looking smile that can last for years with proper care.",
    ],
    benefits: [
      "Dramatically improve smile aesthetics",
      "Fix chips, stains, and uneven teeth",
      "Ultra-thin — minimal tooth preparation",
      "Stain-resistant porcelain material",
      "Natural-looking, long-lasting results",
    ],
  },
  {
    id: "teeth-in-a-day",
    title: "Teeth-in-a-Day",
    tagline: "Walk In, Walk Out Smiling",
    description: [
      "Teeth-in-a-Day is exactly what it sounds like: you walk into our office with missing or failing teeth, and you walk out the same day with a brand new set of beautiful teeth. This isn't a temporary solution — these are your new permanent teeth.",
      "Using advanced 3D imaging and guided surgery, Dr. Pournejad plans and executes your entire treatment with precision, ensuring optimal results in the shortest possible time.",
    ],
    benefits: [
      "Complete transformation in one appointment",
      "No weeks of waiting with missing teeth",
      "Immediate improvement in appearance and function",
      "3D-guided precision placement",
      "Resume normal activities quickly",
    ],
  },
  {
    id: "bone-grafting",
    title: "Bone Grafting",
    tagline: "Building a Strong Foundation",
    description: [
      "When teeth are missing, the jawbone naturally begins to deteriorate over time. Bone grafting is a procedure that rebuilds and strengthens the jawbone, creating a solid foundation for dental implants.",
      "Dr. Pournejad uses advanced bone grafting techniques and premium materials to regenerate bone where it has been lost. This procedure is often the first step in making dental implants possible for patients who have been told they don't have enough bone.",
    ],
    benefits: [
      "Restores jawbone density and volume",
      "Makes dental implants possible after bone loss",
      "Preserves facial structure",
      "Uses biocompatible, premium materials",
      "Performed with precision and comfort",
    ],
  },
  {
    id: "consultation",
    title: "Free Consultation",
    tagline: "Your Journey Starts Here",
    description: [
      "Every great smile transformation begins with a conversation. During your free consultation, Dr. Pournejad will perform a comprehensive examination, take 3D CT scans of your jaw, and discuss your goals and concerns.",
      "You'll receive a personalized treatment plan with clear options, a full cost breakdown, and information about financing. There's absolutely no obligation — just expert guidance to help you make the best decision for your smile.",
    ],
    benefits: [
      "Comprehensive dental examination",
      "Advanced 3D CT imaging",
      "Personalized treatment plan",
      "Clear cost breakdown and financing options",
      "No obligation whatsoever",
    ],
  },
];

export default function ServicesList() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="section-container">
        <div className="space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-2 gap-16 items-start"
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                {service.image ? (
                  <div className="space-y-4">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream shadow-lg">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Second image if available */}
                    {service.image2 && (
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream shadow-lg">
                        <Image
                          src={service.image2}
                          alt={`${service.title} — additional example`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-2xl bg-cream overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-xl bg-gold/10 mx-auto mb-4 flex items-center justify-center">
                          <span className="text-gold text-2xl font-heading">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="text-navy/30 text-sm">Photo coming soon</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <p className="text-gold font-semibold text-sm mb-3">{service.tagline}</p>
                <h2 className="font-heading text-3xl md:text-4xl text-navy mb-6 leading-tight">
                  {service.title}
                </h2>

                <div className="space-y-4 text-gray text-[16px] leading-relaxed mb-8">
                  {service.description.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <ul className="space-y-3 mb-10">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-dark text-[15px]">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button href="/consultation" variant="gold" size="md">
                  Schedule Free Consultation
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
