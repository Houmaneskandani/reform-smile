"use client";

import { motion } from "framer-motion";
import { Phone, Calendar, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export default function CTASection() {
  return (
    <section className="relative py-16 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
            Take the First Step
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
            Ready to Transform{" "}
            <span className="text-gold italic">Your Smile?</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            Schedule your free consultation with Dr. Pournejad today. Get a
            comprehensive evaluation, 3D imaging, and a personalized treatment
            plan — all at no cost to you.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-14">
            <Button href="/consultation" variant="gold" size="lg">
              <Calendar size={20} className="mr-2" />
              Book Free Consultation
            </Button>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full border-2 border-white/25 text-white hover:bg-white hover:text-navy transition-all duration-300 font-semibold text-lg"
            >
              <Phone size={20} />
              Call Now
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-white/50 text-sm">
            <span className="flex items-center gap-2">
              <Check size={16} className="text-gold" />
              No-obligation consultation
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-gold" />
              Financing options available
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-gold" />
              Most insurance accepted
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
