"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { SERVICE_ICONS } from "@/components/sections/Services";
import { SERVICES, type ServiceId } from "@/lib/constants";

type ServicePhotos = {
  image?: string;
  image2?: string;
};

// Photos for each service, keyed by id (photos stay in code for now). The text (title,
// summary, tagline, paragraphs and benefits) comes from SERVICES, which is edited in
// content/services.json. Every service id must have an entry here (TypeScript enforces this).
const SERVICE_PHOTOS: Record<ServiceId, ServicePhotos> = {
  "full-arch": {
    image: "/images/cases/case-4-prosthetic.jpg",
    image2: "/images/cases/case-1-full-arch.jpg",
  },
  "single-implants": {
    image: "/images/cases/case-3-implant-placement.jpg",
  },
  veneers: {
    image: "/images/cases/case-2-before-after.jpg",
  },
  "snap-on-dentures": {},
  consultation: {},
};

const services = SERVICES.map((service) => ({
  ...service,
  ...SERVICE_PHOTOS[service.id],
  icon: SERVICE_ICONS[service.id],
}));

export default function ServicesList() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="section-container">
        <div className="space-y-24">
          {/* Each service is an anchor target (/services#<id>); scroll-mt keeps the
              sticky header (h-20 / md:h-24) from covering the heading. The id sits on a
              plain wrapper, not the animated element: its entrance translateY would
              otherwise be measured by scrollIntoView and the section would land too high. */}
          {services.map((service, index) => (
            <div key={service.id} id={service.id} className="scroll-mt-28 md:scroll-mt-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-2 gap-16 items-start"
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  {service.image ? (
                    <div className="space-y-4">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream shadow-lg">
                        <Image
                          src={service.image}
                          alt={service.title}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Second image if available */}
                      {service.image2 && (
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream shadow-lg">
                          <Image
                            src={service.image2}
                            alt={`${service.title} — additional example`}
                            width={800}
                            height={600}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    // No photo yet — branded panel with the service icon and summary
                    <div className="aspect-[4/3] rounded-2xl bg-cream overflow-hidden relative">
                      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
                      <div className="relative w-full h-full flex items-center justify-center p-8">
                        <div className="text-center max-w-sm">
                          <div className="w-20 h-20 rounded-xl bg-gold/10 mx-auto mb-6 flex items-center justify-center">
                            <service.icon size={36} className="text-gold" strokeWidth={1.5} aria-hidden="true" />
                          </div>
                          <p className="font-heading italic text-navy/80 text-lg md:text-xl leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <p className="text-gold font-semibold text-sm mb-3">{service.tagline}</p>
                  <h2 className="font-heading text-3xl md:text-4xl text-navy mb-6 leading-tight">
                    {service.title}
                  </h2>

                  <div className="space-y-4 text-gray text-[16px] leading-relaxed mb-8">
                    {service.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  <ul className="space-y-3 mb-10">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-dark text-[15px]">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button href="/consultation" variant="gold" size="md">
                    Schedule Free Consultation
                  </Button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
