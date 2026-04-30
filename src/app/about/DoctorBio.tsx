"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, Users, Heart, BookOpen, Globe } from "lucide-react";

const credentials = [
  { icon: GraduationCap, title: "Education", text: "Doctor of Dental Surgery (DDS)" },
  { icon: Award, title: "Specialization", text: "Advanced training in full arch restorations and All-on-X implant procedures" },
  { icon: Users, title: "Experience", text: "Over 500 successful dental implant procedures performed" },
  { icon: BookOpen, title: "Continuing Education", text: "Committed to staying at the forefront of implant dentistry through ongoing training" },
  { icon: Globe, title: "Technology", text: "Utilizes 3D CT scanning, digital treatment planning, and guided implant surgery" },
  { icon: Heart, title: "Philosophy", text: "Patient-first approach — every treatment plan is tailored to individual needs and goals" },
];

export default function DoctorBio() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="section-container">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24 items-start">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex justify-center lg:sticky lg:top-32"
          >
            <div className="relative w-full max-w-sm">
              <div className="aspect-[3/4] rounded-2xl bg-cream overflow-hidden shadow-lg">
                {/* TODO: Replace with Dr. Ava's professional photo */}
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-cream to-white">
                  <div className="w-28 h-28 rounded-full bg-gold/15 mb-6 flex items-center justify-center">
                    <span className="text-gold text-4xl font-heading">A</span>
                  </div>
                  <p className="text-navy/40 text-sm text-center">Professional Photo</p>
                  <p className="text-navy/25 text-xs mt-1">(Placeholder)</p>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border-2 border-gold/30 rounded-2xl -z-10" />
            </div>
          </motion.div>

          {/* Bio content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-8 leading-tight">
              Dr. Ava Pournejad, DDS
            </h2>

            <div className="space-y-6 text-gray text-[17px] leading-relaxed mb-14">
              <p>
                Dr. Ava Pournejad is a dedicated dental professional with a passion
                for transforming lives through advanced implant dentistry. She
                founded Reform Smile & Dental Implant Center with a clear mission:
                to provide every patient with access to world-class dental implant
                solutions in a caring, comfortable environment.
              </p>
              <p>
                With extensive training in All-on-X procedures, full arch
                restorations, and bone grafting techniques, Dr. Pournejad brings
                both technical excellence and genuine compassion to every case. She
                understands that losing teeth affects more than just your smile — it
                impacts your confidence, your health, and your quality of life.
              </p>
              <p>
                Dr. Pournejad&apos;s approach begins with listening. Every patient
                receives a thorough consultation, including advanced 3D imaging, to
                develop a treatment plan that&apos;s tailored specifically to their
                needs. Her goal is simple: to help you smile with confidence again.
              </p>
            </div>

            {/* Credentials grid */}
            <div className="grid sm:grid-cols-2 gap-8">
              {credentials.map((cred, index) => (
                <motion.div
                  key={cred.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-cream flex items-center justify-center flex-shrink-0">
                    <cred.icon size={20} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy text-[15px] mb-1">{cred.title}</h3>
                    <p className="text-gray text-sm leading-relaxed">{cred.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
