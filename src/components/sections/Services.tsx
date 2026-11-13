"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Crosshair,
  Smile,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useRef, useState } from "react";
import { SERVICES, type ServiceId } from "@/lib/constants";

type Service = (typeof SERVICES)[number];

// One icon per service — shared with the Services page so both always match.
export const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  "full-arch": Crosshair,
  "single-implants": Stethoscope,
  veneers: Sparkles,
  "snap-on-dentures": Smile,
  consultation: ArrowRight,
};

// The free consultation is shown as a highlighted call-to-action card rather than a
// regular treatment card. It is last in SERVICES and spans two grid columns, so the
// four treatments + consultation fill a 2-column (tablet) or 3-column (desktop) grid evenly.
const isConsultation = (service: Service) => service.id === "consultation";

const serviceHref = (id: ServiceId) => `/services#${id}`;

function ChevronIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function MobileServiceCarousel() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.offsetWidth * 0.8 + 12; // card width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActive(Math.min(index, SERVICES.length - 1));
  };

  return (
    <div className="md:hidden -mx-8">
      {/* Swipeable cards */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-8 pb-6 scrollbar-hide"
      >
        {SERVICES.map((service) => {
          const Icon = SERVICE_ICONS[service.id];

          if (isConsultation(service)) {
            return (
              <div
                key={service.id}
                className="flex-shrink-0 w-[80%] snap-center bg-navy rounded-2xl p-6 shadow-sm relative overflow-hidden"
              >
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center mb-5">
                    <Icon size={24} className="text-gold-ink" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-white/70 text-[14px] leading-relaxed mb-5">
                    {service.description}
                  </p>
                  <div className="flex flex-col items-start gap-3">
                    <Button href="/consultation" variant="gold" size="sm" className="whitespace-nowrap">
                      Book Free Consult
                    </Button>
                    <Link
                      href={serviceHref(service.id)}
                      className="inline-flex items-center gap-1.5 text-gold-ink text-sm font-semibold"
                    >
                      Learn More<span className="sr-only"> about {service.title}</span>
                      <ChevronIcon />
                    </Link>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={service.id}
              href={serviceHref(service.id)}
              className="flex-shrink-0 w-[80%] snap-center bg-white rounded-2xl p-6 border border-gray-lighter shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center mb-5">
                <Icon size={24} className="text-navy" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl text-navy mb-3">
                {service.title}
              </h3>
              <p className="text-gray text-[14px] leading-relaxed mb-4">
                {service.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-gold-ink text-sm font-semibold">
                Learn More
                <ChevronIcon />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-2" aria-hidden="true">
        {SERVICES.map((service, i) => (
          <div
            key={service.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? "w-6 bg-gold" : "w-1.5 bg-gray-lighter"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-20"
        >
          <p className="text-gold-ink font-semibold tracking-widest uppercase text-sm mb-4">
            Our Services
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
            Advanced Implant Solutions
          </h2>
          <p className="text-gray text-lg leading-relaxed">
            We specialize in full arch dental implants using the latest
            technology and techniques to deliver permanent, natural-looking
            results that transform lives.
          </p>
        </motion.div>

        {/* Desktop grid — four treatment cards + a highlighted consultation card */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.id];

            if (isConsultation(service)) {
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="col-span-2"
                >
                  <div className="h-full bg-navy rounded-2xl p-8 lg:p-10 shadow-lg relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
                    {/* Stacked while the card is narrow; text + actions side by side on xl */}
                    <div className="relative h-full flex flex-col justify-center gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-10">
                      <div className="max-w-md">
                        <div className="w-14 h-14 rounded-xl bg-gold/15 flex items-center justify-center mb-7">
                          <Icon size={26} className="text-gold-ink" strokeWidth={1.5} />
                        </div>
                        <p className="text-gold-ink font-semibold tracking-widest uppercase text-xs mb-3">
                          Start Here
                        </p>
                        <h3 className="font-heading text-2xl text-white mb-4 leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-white/70 text-[15px] leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 xl:flex-col xl:flex-shrink-0">
                        <Button href="/consultation" variant="gold" size="md">
                          Book Free Consultation
                        </Button>
                        <Link
                          href={serviceHref(service.id)}
                          className="inline-flex items-center gap-1.5 text-gold-ink text-sm font-semibold hover:text-gold-light transition-colors duration-300"
                        >
                          Learn More<span className="sr-only"> about {service.title}</span>
                          <ChevronIcon />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  href={serviceHref(service.id)}
                  className="group block h-full bg-white rounded-2xl p-8 lg:p-10 border border-gray-lighter hover:border-gold/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/[0.02] group-hover:to-gold/[0.06] transition-all duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-cream flex items-center justify-center mb-7 group-hover:bg-gold/10 transition-colors duration-300">
                      <Icon size={26} className="text-navy group-hover:text-gold-ink transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl text-navy mb-4 leading-snug">{service.title}</h3>
                    <p className="text-gray text-[15px] leading-relaxed mb-4">{service.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-gold-ink text-sm font-semibold opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-300">
                      Learn More
                      <ChevronIcon />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile — horizontal carousel */}
        <MobileServiceCarousel />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12 md:mt-20"
        >
          <Button href="/services" variant="primary" size="lg">
            View All Services
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
