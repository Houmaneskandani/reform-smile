"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { submitForm } from "@/lib/submitForm";
import { Calendar, Check, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

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
});

type BookingFormData = z.infer<typeof bookingSchema>;

const services = [
  "All-on-4 Dental Implants",
  "All-on-6 Dental Implants",
  "Teeth-in-a-Day",
  "Bone Grafting",
  "Full Mouth Reconstruction",
  "Free Consultation",
  "General Checkup",
  "Other",
];

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
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    await submitForm(data as Record<string, string>, "Appointment Request");
    setSubmitted(true);
  };

  const inputClass = "w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm";
  const selectClass = "w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-white text-dark focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors text-sm appearance-none cursor-pointer";

  return (
    <section className="py-28 md:py-36 bg-white">
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
                  <Calendar size={36} className="text-gold" />
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
                  className="inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-dark transition-colors"
                >
                  <Phone size={16} />
                  Need it sooner? Call {SITE_CONFIG.phone}
                </a>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Calendar size={24} className="text-gold" />
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
                      <label className="block text-navy text-sm font-medium mb-2">First Name *</label>
                      <input {...register("firstName")} placeholder="First name" className={inputClass} />
                      {errors.firstName && <p className="text-red-500 text-[11px] mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Last Name *</label>
                      <input {...register("lastName")} placeholder="Last name" className={inputClass} />
                      {errors.lastName && <p className="text-red-500 text-[11px] mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Email *</label>
                      <input {...register("email")} type="email" placeholder="your@email.com" className={inputClass} />
                      {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Phone *</label>
                      <input {...register("phone")} type="tel" placeholder="(555) 123-4567" className={inputClass} />
                      {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Service + New Patient */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Service *</label>
                      <select {...register("service")} defaultValue="" className={selectClass}>
                        <option value="" disabled>Select a service</option>
                        {services.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.service && <p className="text-red-500 text-[11px] mt-1">{errors.service.message}</p>}
                    </div>
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">New Patient? *</label>
                      <select {...register("isNewPatient")} defaultValue="" className={selectClass}>
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes, I&apos;m a new patient</option>
                        <option value="no">No, I&apos;m a returning patient</option>
                      </select>
                      {errors.isNewPatient && <p className="text-red-500 text-[11px] mt-1">{errors.isNewPatient.message}</p>}
                    </div>
                  </div>

                  {/* Date + Time */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Preferred Date *</label>
                      <input {...register("preferredDate")} type="date" className={inputClass} />
                      {errors.preferredDate && <p className="text-red-500 text-[11px] mt-1">{errors.preferredDate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-navy text-sm font-medium mb-2">Preferred Time *</label>
                      <select {...register("preferredTime")} defaultValue="" className={selectClass}>
                        <option value="" disabled>Select a time</option>
                        {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.preferredTime && <p className="text-red-500 text-[11px] mt-1">{errors.preferredTime.message}</p>}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-navy text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      {...register("notes")}
                      rows={3}
                      placeholder="Anything we should know before your visit?"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Check size={18} />
                    Request Appointment
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
