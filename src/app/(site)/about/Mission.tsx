"use client";

import { motion } from "framer-motion";

export default function Mission() {
  return (
    <section className="py-28 md:py-36 bg-cream">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
              Our Mission
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-navy mb-10 leading-tight">
              Why Reform Smile Exists
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6 text-gray text-lg leading-relaxed"
          >
            <p>
              Too many people live with the pain, embarrassment, and limitations
              of missing or failing teeth. At Reform Smile, we believe that
              everyone — regardless of their dental history — deserves a
              confident, beautiful smile.
            </p>
            <p>
              We founded this practice to make advanced dental implant solutions
              accessible, understandable, and comfortable. From your very first
              consultation to the moment you see your new smile, our team is with
              you every step of the way.
            </p>
            <p>
              Our name says it all: <span className="text-navy font-semibold">Reform</span>.
              We&apos;re here to reform your smile, reform your confidence, and
              reform the way you experience dental care.
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-20"
          >
            {[
              { value: "Excellence", desc: "We never compromise on the quality of care, materials, or results." },
              { value: "Compassion", desc: "We treat every patient like family — with patience, empathy, and respect." },
              { value: "Innovation", desc: "We invest in the latest technology to deliver the best possible outcomes." },
            ].map((item) => (
              <div key={item.value} className="text-center">
                <h3 className="font-heading text-2xl text-navy mb-3">{item.value}</h3>
                <p className="text-gray text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
