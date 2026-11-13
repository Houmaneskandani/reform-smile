"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { submitForm } from "@/lib/submitForm";
import { Calendar, Check, Phone } from "lucide-react";
import { SERVICES, SITE_CONFIG } from "@/lib/constants";

const bookingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  service: z.string().min(1, "Please select a service"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  isNewPatient: z.string().min(1, "Please select"),
  notes: z.string().optional(),
  botcheck: z.string().optional(), // spam honeypot — must stay empty
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Built from the canonical service list so the dropdown always matches what we offer.
// The submitted value is the service title, so the practice email stays readable.
const services = [...SERVICES.map((s) => s.title), "Not sure yet"];

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
];

export default function BookForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setSubmitError(null);
    const result = await submitForm(data as Record<string, string>, "Appointment Request");
    if (result.success) {
      setSubmitted(true);
    } else {
      // Keep everything the patient typed so they can retry or call instead.
      setSubmitError(result.message);
    }
  };

  // Links each field to its error message for screen readers.
  const fieldA11y = (name: keyof BookingFormData) => ({
    id: `book-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `book-${name}-error` : undefined,
  });

  const inputClass = "w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm";
  const selectClass = "w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm appearance-none cursor-pointer";

  return (
    <section className="py-28 md:py-24 bg-white">
      <div className="section-container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-cream rounded-3xl p-8 md:p-12">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Calendar size={36} className="text-gold-ink" />
                </div>
                <h3 className="font-heading text-3xl text-navy mb-4">
                  Appointment Requested!
                </h3>
                <p className="text-gray text-lg mb-6 max-w-md mx-auto">
                  Thank you! We&apos;ll review your request and confirm your
                  appointment within 24 hours.
                </p>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
                  className="inline-flex items-center gap-2 text-gold-ink font-semibold hover:text-gold-dark transition-colors"
                >
                  <Phone size={16} />
                  Need it sooner? Call {SITE_CONFIG.phone}
                </a>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Calendar size={24} className="text-gold-ink" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl text-navy">
                      Request an Appointment
                    </h2>
                    <p className="text-gray text-sm">
                      Fill out the form and we&apos;ll confirm within 24 hours.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="book-firstName" className="block text-navy text-sm font-medium mb-2">First Name *</label>
                      <input {...register("firstName")} {...fieldA11y("firstName")} type="text" autoComplete="given-name" placeholder="First name" className={inputClass} />
                      {errors.firstName && <p id="book-firstName-error" className="text-red-500 text-[11px] mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-lastName" className="block text-navy text-sm font-medium mb-2">Last Name *</label>
                      <input {...register("lastName")} {...fieldA11y("lastName")} type="text" autoComplete="family-name" placeholder="Last name" className={inputClass} />
                      {errors.lastName && <p id="book-lastName-error" className="text-red-500 text-[11px] mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="book-email" className="block text-navy text-sm font-medium mb-2">Email *</label>
                      <input {...register("email")} {...fieldA11y("email")} type="email" autoComplete="email" placeholder="your@email.com" className={inputClass} />
                      {errors.email && <p id="book-email-error" className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-phone" className="block text-navy text-sm font-medium mb-2">Phone *</label>
                      <input {...register("phone")} {...fieldA11y("phone")} type="tel" autoComplete="tel" placeholder="(555) 123-4567" className={inputClass} />
                      {errors.phone && <p id="book-phone-error" className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Service + New Patient */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="book-service" className="block text-navy text-sm font-medium mb-2">Service *</label>
                      <select {...register("service")} {...fieldA11y("service")} defaultValue="" className={selectClass}>
                        <option value="" disabled>Select a service</option>
                        {services.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.service && <p id="book-service-error" className="text-red-500 text-[11px] mt-1">{errors.service.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-isNewPatient" className="block text-navy text-sm font-medium mb-2">New Patient? *</label>
                      <select {...register("isNewPatient")} {...fieldA11y("isNewPatient")} defaultValue="" className={selectClass}>
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes, I&apos;m a new patient</option>
                        <option value="no">No, I&apos;m a returning patient</option>
                      </select>
                      {errors.isNewPatient && <p id="book-isNewPatient-error" className="text-red-500 text-[11px] mt-1">{errors.isNewPatient.message}</p>}
                    </div>
                  </div>

                  {/* Date + Time */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="book-preferredDate" className="block text-navy text-sm font-medium mb-2">Preferred Date *</label>
                      <input {...register("preferredDate")} {...fieldA11y("preferredDate")} type="date" className={inputClass} />
                      {errors.preferredDate && <p id="book-preferredDate-error" className="text-red-500 text-[11px] mt-1">{errors.preferredDate.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="book-preferredTime" className="block text-navy text-sm font-medium mb-2">Preferred Time *</label>
                      <select {...register("preferredTime")} {...fieldA11y("preferredTime")} defaultValue="" className={selectClass}>
                        <option value="" disabled>Select a time</option>
                        {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.preferredTime && <p id="book-preferredTime-error" className="text-red-500 text-[11px] mt-1">{errors.preferredTime.message}</p>}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="book-notes" className="block text-navy text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      {...register("notes")}
                      id="book-notes"
                      rows={3}
                      placeholder="Anything we should know before your visit?"
                      className={`${inputClass} resize-none`}
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
                    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm text-red-700">
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy-dark font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Check size={18} />
                    {isSubmitting ? "Sending…" : "Request Appointment"}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
