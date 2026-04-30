"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Check, Star, Shield, Clock, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const consultationSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  concern: z.string().min(1, "Please select your primary concern"),
  message: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

const concerns = [
  "Missing teeth",
  "Failing or damaged teeth",
  "Uncomfortable dentures",
  "Interested in All-on-4",
  "Interested in All-on-6",
  "Need a second opinion",
  "Other",
];

export default function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = (data: ConsultationFormData) => {
    console.log("Consultation form:", data);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal top bar */}
      <div className="bg-navy border-b border-white/10">
        <div className="section-container flex items-center justify-between py-5">
          <a href="/">
            <Image
              src="/logo-white.png"
              alt="Reform Smile"
              width={280}
              height={280}
              className="h-20 md:h-24 w-auto"
            />
          </a>
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
            className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors text-sm font-semibold"
          >
            <Phone size={16} />
            <span className="hidden sm:inline">{SITE_CONFIG.phone}</span>
            <span className="sm:hidden">Call Us</span>
          </a>
        </div>
      </div>

      {/* Hero section — conversion-focused */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-gold/5 blur-3xl" />
        </div>

        <div className="relative section-container py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left: Headline + trust signals */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src="/logo-white.png"
                  alt="Reform Smile"
                  width={200}
                  height={200}
                  className="h-20 w-auto mb-10"
                />

                <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">
                  Schedule Your{" "}
                  <span className="text-gold italic">Free</span> Consultation
                </h1>
                <p className="text-white/70 text-lg leading-relaxed mb-10">
                  Take the first step toward your new smile. Meet Dr. Pournejad
                  for a comprehensive evaluation, 3D imaging, and personalized
                  treatment plan — at absolutely no cost to you.
                </p>

                {/* What's included */}
                <div className="space-y-4 mb-10">
                  {[
                    "Comprehensive dental examination",
                    "Advanced 3D CT scan imaging",
                    "Personalized treatment plan",
                    "Full cost breakdown & financing options",
                    "No obligation whatsoever",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Check size={18} className="text-gold flex-shrink-0" />
                      <span className="text-white/80 text-[15px]">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-gold" />
                    <span className="text-white/60 text-sm">Board Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-gold" />
                    <span className="text-white/60 text-sm">5.0 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gold" />
                    <span className="text-white/60 text-sm">Same-Day Results</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                      <Check size={36} className="text-gold" />
                    </div>
                    <h3 className="font-heading text-2xl text-navy mb-3">
                      Thank You!
                    </h3>
                    <p className="text-gray mb-6">
                      We&apos;ve received your consultation request. Our team
                      will contact you within 24 hours to schedule your
                      appointment.
                    </p>
                    <a
                      href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
                      className="inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-dark transition-colors"
                    >
                      <Phone size={16} />
                      Or call us now: {SITE_CONFIG.phone}
                    </a>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading text-2xl text-navy mb-2">
                      Request Your Free Consultation
                    </h2>
                    <p className="text-gray text-sm mb-8">
                      Fill out the form below and we&apos;ll contact you to schedule.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            {...register("firstName")}
                            placeholder="First Name *"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                          />
                          {errors.firstName && <p className="text-red-500 text-[11px] mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                          <input
                            {...register("lastName")}
                            placeholder="Last Name *"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                          />
                          {errors.lastName && <p className="text-red-500 text-[11px] mt-1">{errors.lastName.message}</p>}
                        </div>
                      </div>

                      <div>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="Email Address *"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                        />
                        {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
                      </div>

                      <div>
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="Phone Number *"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                        />
                        {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>}
                      </div>

                      <div>
                        <select
                          {...register("concern")}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm appearance-none cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>Primary Concern *</option>
                          {concerns.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        {errors.concern && <p className="text-red-500 text-[11px] mt-1">{errors.concern.message}</p>}
                      </div>

                      <div>
                        <textarea
                          {...register("message")}
                          rows={3}
                          placeholder="Anything else you'd like us to know? (optional)"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-base flex items-center justify-center gap-2"
                      >
                        Request My Free Consultation
                        <ArrowRight size={18} />
                      </button>

                      <p className="text-gray-light text-[11px] text-center">
                        By submitting, you agree to be contacted about your dental care.
                        We respect your privacy and will never share your information.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="bg-cream py-14">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              {
                quote: "Dr. Pournejad gave me my life back. I can't stop smiling.",
                name: "Sarah M.",
                procedure: "All-on-4 Patient",
              },
              {
                quote: "The best decision I ever made. My only regret is not doing it sooner.",
                name: "James R.",
                procedure: "Full Arch Patient",
              },
              {
                quote: "The whole team made me feel comfortable from day one. Incredible results.",
                name: "Maria L.",
                procedure: "Teeth-in-a-Day Patient",
              },
            ].map((t) => (
              <div key={t.name} className="text-center">
                <div className="flex justify-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-dark/70 text-sm italic mb-3">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-navy font-semibold text-sm">{t.name}</p>
                <p className="text-gold text-xs">{t.procedure} *</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-light text-[10px] mt-8 italic">
            * Sample testimonials — will be replaced with real patient reviews
          </p>
        </div>
      </section>
    </div>
  );
}
