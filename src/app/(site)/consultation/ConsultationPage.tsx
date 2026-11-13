"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { submitForm } from "@/lib/submitForm";
import Image from "next/image";
import { Phone, Check, Star, Shield, Clock, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { testimonials } from "@/content";
import { CookieSettingsButton } from "@/components/CookieConsent";

const consultationSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  concern: z.string().min(1, "Please select your primary concern"),
  message: z.string().optional(),
  botcheck: z.string().optional(), // spam honeypot — must stay empty
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

// Reviews for the social proof strip, edited in content/testimonials.json (the short quote
// and label are used when set; real reviews without permission on file are already left out).
// Sample reviews get an asterisk and the note below them. With no reviews, the strip shows
// only the cookie settings link.
const reviews = testimonials.items.filter((review) => review.showOnConsultation);
const showSampleNote = reviews.some((review) => review.isSample);

const concerns = [
  "Missing teeth",
  "Failing or damaged teeth",
  "Uncomfortable dentures",
  "Interested in full arch implants (All-on-X)",
  "Interested in snap-on dentures",
  "Need a second opinion",
  "Other",
];

export default function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: ConsultationFormData) => {
    setSubmitError(null);
    const result = await submitForm(data as Record<string, string>, "Free Consultation Request");
    if (result.success) {
      setSubmitted(true);
    } else {
      // Keep everything the patient typed so they can retry or call instead.
      setSubmitError(result.message);
    }
  };

  // Links each field to its error message for screen readers.
  const fieldA11y = (name: keyof ConsultationFormData) => ({
    id: `consult-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `consult-${name}-error` : undefined,
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal top bar */}
      <div className="bg-navy border-b border-white/10">
        <div className="section-container flex items-center justify-between py-5">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- cross-layout nav must be a full page load (see CLAUDE.md) */}
          <a href="/">
            <Image
              src="/logo-white.png"
              alt="Reform Dental"
              width={280}
              height={280}
              className="h-20 md:h-24 w-auto"
            />
          </a>
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
            className="flex items-center gap-2 text-white/80 hover:text-gold-ink transition-colors text-sm font-semibold"
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
                  alt="Reform Dental"
                  width={200}
                  height={200}
                  className="h-20 w-auto mb-10"
                />

                <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-6">
                  Schedule Your{" "}
                  <span className="text-gold-ink italic">Free</span> Consultation
                </h1>
                <p className="text-white/70 text-lg leading-relaxed mb-10">
                  Take the first step toward your new smile. Meet our team
                  for a comprehensive evaluation, 3D imaging, and a personalized
                  treatment plan — at absolutely no cost to you.
                </p>

                {/* What's included */}
                <div className="space-y-4 mb-10">
                  {[
                    "Comprehensive dental examination",
                    "Advanced 3D CT scan imaging",
                    "Personalized treatment plan",
                    "Full financing options",
                    "No obligation whatsoever",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Check size={18} className="text-gold-ink flex-shrink-0" />
                      <span className="text-white/80 text-[15px]">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-gold-ink" />
                    <span className="text-white/60 text-sm">Board Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-gold-ink" />
                    <span className="text-white/60 text-sm">5.0 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-gold-ink" />
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
                      <Check size={36} className="text-gold-ink" />
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
                      className="inline-flex items-center gap-2 text-gold-ink font-semibold hover:text-gold-dark transition-colors"
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
                          <label htmlFor="consult-firstName" className="sr-only">First name (required)</label>
                          <input
                            {...register("firstName")}
                            {...fieldA11y("firstName")}
                            type="text"
                            autoComplete="given-name"
                            placeholder="First Name *"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                          />
                          {errors.firstName && <p id="consult-firstName-error" className="text-red-500 text-[11px] mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                          <label htmlFor="consult-lastName" className="sr-only">Last name (required)</label>
                          <input
                            {...register("lastName")}
                            {...fieldA11y("lastName")}
                            type="text"
                            autoComplete="family-name"
                            placeholder="Last Name *"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                          />
                          {errors.lastName && <p id="consult-lastName-error" className="text-red-500 text-[11px] mt-1">{errors.lastName.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="consult-email" className="sr-only">Email address (required)</label>
                        <input
                          {...register("email")}
                          {...fieldA11y("email")}
                          type="email"
                          autoComplete="email"
                          placeholder="Email Address *"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                        />
                        {errors.email && <p id="consult-email-error" className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="consult-phone" className="sr-only">Phone number (required)</label>
                        <input
                          {...register("phone")}
                          {...fieldA11y("phone")}
                          type="tel"
                          autoComplete="tel"
                          placeholder="Phone Number *"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm"
                        />
                        {errors.phone && <p id="consult-phone-error" className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="consult-concern" className="sr-only">Primary concern (required)</label>
                        <select
                          {...register("concern")}
                          {...fieldA11y("concern")}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm appearance-none cursor-pointer"
                          defaultValue=""
                        >
                          <option value="" disabled>Primary Concern *</option>
                          {concerns.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        {errors.concern && <p id="consult-concern-error" className="text-red-500 text-[11px] mt-1">{errors.concern.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="consult-message" className="sr-only">Anything else you&apos;d like us to know (optional)</label>
                        <textarea
                          {...register("message")}
                          {...fieldA11y("message")}
                          rows={3}
                          placeholder="Anything else you'd like us to know? (optional)"
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-lighter bg-gray-lighter/30 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm resize-none"
                        />
                      </div>

                      {/* Spam honeypot — hidden from people; bots that fill it are ignored */}
                      <input
                        {...register("botcheck")}
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="hidden"
                      />

                      {submitError && (
                        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
                          {submitError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gold hover:bg-gold-dark text-navy-dark font-semibold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Sending…" : "Request My Free Consultation"}
                        <ArrowRight size={18} />
                      </button>

                      <p className="text-gray-light text-[11px] text-center">
                        By submitting, you agree to be contacted about your dental care.
                        See our{" "}
                        <a href="/privacy" className="underline hover:text-navy">
                          Privacy Policy
                        </a>
                        .
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
          {reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              {reviews.map((t, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center gap-0.5 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-gold-ink fill-gold" />
                    ))}
                  </div>
                  <p className="text-dark/70 text-sm italic mb-3">
                    &ldquo;{t.shortQuote || t.quote}&rdquo;
                  </p>
                  <p className="text-navy font-semibold text-sm">{t.displayName}</p>
                  <p className="text-gold-ink text-xs">{t.shortTreatmentLabel || t.treatmentLabel}{t.isSample && " *"}</p>
                </div>
              ))}
            </div>
          )}
          {showSampleNote && (
            <p className="text-center text-gray-light text-[10px] mt-8 italic">
              * Sample testimonials — will be replaced with real patient reviews
            </p>
          )}
          {/* This page has no site footer, so it needs its own way to reopen the cookie choice */}
          <div className="text-center mt-6">
            <CookieSettingsButton className="text-gray-light hover:text-navy text-xs underline underline-offset-2 transition-colors cursor-pointer" />
          </div>
        </div>
      </section>
    </div>
  );
}
