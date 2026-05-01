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
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactContent() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    await submitForm(data as Record<string, string>, "Contact Form");
    setSubmitted(true);
  };

  return (
    <section className="py-28 md:py-36 bg-white">
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
                  <Phone size={22} className="text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Phone</h3>
                  <a href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`} className="text-gray hover:text-gold transition-colors">
                    {SITE_CONFIG.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center flex-shrink-0">
                  <Mail size={22} className="text-gold" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Email</h3>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-gray hover:text-gold transition-colors">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-gold" strokeWidth={1.5} />
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
                  <Clock size={22} className="text-gold" strokeWidth={1.5} />
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

            {/* Google Maps embed */}
            <div className="mt-12 aspect-[4/3] rounded-2xl bg-cream overflow-hidden">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                  `${SITE_CONFIG.address}, ${SITE_CONFIG.city}, ${SITE_CONFIG.state} ${SITE_CONFIG.zip}`
                )}&zoom=14`}
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
                    <Send size={32} className="text-gold" />
                  </div>
                  <h3 className="font-heading text-2xl text-navy mb-3">Message Sent!</h3>
                  <p className="text-gray">Thank you for reaching out. We&apos;ll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Full Name *</label>
                      <input
                        {...register("name")}
                        className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Email *</label>
                      <input
                        {...register("email")}
                        type="email"
                        className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Phone *</label>
                      <input
                        {...register("phone")}
                        type="tel"
                        className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Subject *</label>
                      <input
                        {...register("subject")}
                        className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="How can we help?"
                      />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-navy text-sm font-medium mb-2">Message *</label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors resize-none"
                      placeholder="Tell us about your dental needs..."
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Send size={18} />
                    Send Message
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
