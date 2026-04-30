"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const services = [
  {
    id: "all-on-4",
    title: "All-on-4 Dental Implants",
    tagline: "A Full Smile in Just One Day",
    description: [
      "The All-on-4 procedure is a revolutionary approach to replacing a full arch of teeth using just four strategically placed dental implants. This technique allows Dr. Pournejad to provide you with a complete set of beautiful, permanent teeth — often in a single appointment.",
      "By angling the posterior implants, we can maximize bone contact without the need for bone grafting in most cases. This means faster treatment, less discomfort, and stunning results from day one.",
    ],
    benefits: [
      "Full arch of permanent teeth in one visit",
      "No denture adhesives — ever",
      "Eat, smile, and laugh with total confidence",
      "Minimal bone grafting required",
      "Natural look and feel",
    ],
  },
  {
    id: "all-on-6",
    title: "All-on-6 Dental Implants",
    tagline: "Enhanced Stability for Your New Smile",
    description: [
      "For patients who need additional support, the All-on-6 procedure uses six implants per arch to provide enhanced stability and strength. This option is ideal for those with greater bone density or who want maximum durability.",
      "The extra two implants distribute biting forces more evenly, making this an excellent choice for patients who want the strongest possible foundation for their new smile.",
    ],
    benefits: [
      "Six implants for maximum stability",
      "Ideal for patients with good bone density",
      "Even distribution of biting forces",
      "Long-lasting, durable results",
      "Permanent, non-removable teeth",
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
    id: "full-mouth",
    title: "Full Mouth Reconstruction",
    tagline: "A Complete Smile Transformation",
    description: [
      "Full mouth reconstruction is a comprehensive approach that combines multiple dental procedures to completely rebuild and restore your smile. This may include dental implants, prosthetics, bone grafting, and other advanced techniques.",
      "Dr. Pournejad creates a detailed, personalized treatment plan that addresses every aspect of your dental health. The result is a complete, beautiful, and functional smile that can last a lifetime.",
    ],
    benefits: [
      "Comprehensive approach to total smile restoration",
      "Customized treatment plan for your unique needs",
      "Addresses both function and aesthetics",
      "Combines the latest techniques and technology",
      "Life-changing results",
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
              className={`grid lg:grid-cols-2 gap-16 items-start ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image placeholder */}
              <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="aspect-[4/3] rounded-2xl bg-cream overflow-hidden">
                  {/* TODO: Replace with real service photo */}
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-xl bg-gold/10 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-gold text-2xl font-heading">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-navy/30 text-sm">Service Photo</p>
                      <p className="text-navy/20 text-xs mt-1">(Placeholder)</p>
                    </div>
                  </div>
                </div>
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
