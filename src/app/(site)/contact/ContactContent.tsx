"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { submitForm } from "@/lib/submitForm";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  botcheck: z.string().optional(), // spam honeypot — must stay empty
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    const result = await submitForm(data as Record<string, string>, "Contact Form");
    if (result.success) {
      setSubmitted(true);
    } else {
      // Keep everything the patient typed so they can retry or call instead.
      setSubmitError(result.message);
    }
  };

  // Links each field to its error message for screen readers.
  const fieldA11y = (name: keyof ContactFormData) => ({
    id: `contact-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  return (
    <section className="py-28 md:py-24 bg-white">
      <div className="section-container">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <h2 className="font-heading text-3xl md:text-4xl text-navy mb-8">
              Get in Touch
            </h2>
            <p className="text-gray text-[16px] leading-relaxed mb-12">
              Whether you have questions about our services, want to schedule a
              consultation, or just need more information — we&apos;re happy to
              help.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center flex-shrink-0">
                  <Phone size={22} className="text-gold-ink" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Phone</h3>
                  <a href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`} className="text-gray hover:text-gold-ink transition-colors">
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center flex-shrink-0">
                  <Mail size={22} className="text-gold-ink" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Email</h3>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-gray hover:text-gold-ink transition-colors">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-gold-ink" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Location</h3>
                  <p className="text-gray">
                    {SITE_CONFIG.address}<br />
                    {SITE_CONFIG.city}, {SITE_CONFIG.state} {SITE_CONFIG.zip}
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center flex-shrink-0">
                  <Clock size={22} className="text-gold-ink" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Office Hours</h3>
                  <p className="text-gray text-[15px]">
                    Mon – Fri: {SITE_CONFIG.hours.weekdays}<br />
                    Saturday: {SITE_CONFIG.hours.saturday}<br />
                    Sunday: {SITE_CONFIG.hours.sunday}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps embed — keyless embed URL, follows the address in constants.ts */}
            <div className="mt-12 aspect-[4/3] rounded-2xl bg-cream overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  `${SITE_CONFIG.address}, ${SITE_CONFIG.city}, ${SITE_CONFIG.state} ${SITE_CONFIG.zip}`
                )}&z=14&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="bg-cream rounded-3xl p-8 md:p-12">
              <h2 className="font-heading text-3xl text-navy mb-3">
                Send Us a Message
              </h2>
              <p className="text-gray mb-10">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <Send size={32} className="text-gold-ink" />
                  </div>
                  <h3 className="font-heading text-2xl text-navy mb-3">Message Sent!</h3>
                  <p className="text-gray">Thank you for reaching out. We&apos;ll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-navy text-sm font-medium mb-2">Full Name *</label>
                      <input
                        {...register("name")}
                        {...fieldA11y("name")}
                        type="text"
                        autoComplete="name"
                        className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="Your name"
                      />
                      {errors.name && <p id="contact-name-error" className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-navy text-sm font-medium mb-2">Email *</label>
                      <input
                        {...register("email")}
                        {...fieldA11y("email")}
                        type="email"
                        autoComplete="email"
                        className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p id="contact-email-error" className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-phone" className="block text-navy text-sm font-medium mb-2">Phone *</label>
                      <input
                        {...register("phone")}
                        {...fieldA11y("phone")}
                        type="tel"
                        autoComplete="tel"
                        className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <p id="contact-phone-error" className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-navy text-sm font-medium mb-2">Subject *</label>
                      <input
                        {...register("subject")}
                        {...fieldA11y("subject")}
                        type="text"
                        className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="How can we help?"
                      />
                      {errors.subject && <p id="contact-subject-error" className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-navy text-sm font-medium mb-2">Message *</label>
                    <textarea
                      {...register("message")}
                      {...fieldA11y("message")}
                      rows={5}
                      className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors resize-none"
                      placeholder="Tell us about your dental needs..."
                    />
                    {errors.message && <p id="contact-message-error" className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
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
                    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm text-red-700">
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy-dark font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    {isSubmitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
