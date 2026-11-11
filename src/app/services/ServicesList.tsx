"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { SERVICE_ICONS } from "@/components/sections/Services";
import { SERVICES, type ServiceId } from "@/lib/constants";

type ServiceDetail = {
  tagline: string;
  image?: string;
  image2?: string;
  body: string[];
  benefits: string[];
};

// Long-form copy for each service, keyed by id. Titles and short descriptions come from
// SERVICES in src/lib/constants.ts, so names can never drift between pages. Every service
// in SERVICES must have an entry here (TypeScript enforces this).
const SERVICE_DETAILS: Record<ServiceId, ServiceDetail> = {
  "full-arch": {
    tagline: "Our Signature Treatment — Complete Smile Restoration",
    image: "/images/cases/case-4-prosthetic.jpg",
    image2: "/images/cases/case-1-full-arch.jpg",
    body: [
      "Full arch dental implants are the gold standard for replacing a complete set of teeth. Using the All-on-X technique, our team places 4-6 strategically positioned implants to support an entire arch of beautiful, permanent teeth.",
      "This approach delivers stunning, natural-looking results — often in a single visit. No more loose dentures, no more adhesives. Just a confident, permanent smile you can eat, laugh, and live with.",
    ],
    benefits: [
      "Full arch of permanent teeth in one visit",
      "No denture adhesives — ever",
      "Eat, smile, and laugh with total confidence",
      "Minimal bone grafting required",
      "Natural look and feel",
      "Long-lasting, durable results",
    ],
  },
  "single-implants": {
    tagline: "Replace Individual Missing Teeth",
    image: "/images/cases/case-3-implant-placement.jpg",
    body: [
      "A single dental implant is the ideal solution for replacing one missing tooth without affecting neighboring teeth. A titanium implant post is placed directly into the jawbone, acting as an artificial root, then topped with a custom-crafted crown.",
      "The result is indistinguishable from your natural teeth — in look, feel, and function. Single implants also preserve bone structure and prevent the shifting of surrounding teeth.",
    ],
    benefits: [
      "Replaces one tooth without affecting others",
      "Looks and feels like a natural tooth",
      "Preserves jawbone structure",
      "Prevents neighboring teeth from shifting",
      "Easy to care for — brush and floss normally",
    ],
  },
  veneers: {
    tagline: "Transform Your Smile's Appearance",
    image: "/images/cases/case-2-before-after.jpg",
    body: [
      "Dental veneers are ultra-thin, custom-made shells that cover the front surface of your teeth to improve their appearance. They're an excellent solution for teeth that are discolored, chipped, worn, misaligned, or unevenly spaced.",
      "Our team uses premium porcelain veneers designed to match the natural translucency and color of real teeth. The result is a flawless, natural-looking smile that can last for years with proper care.",
    ],
    benefits: [
      "Dramatically improve smile aesthetics",
      "Fix chips, stains, and uneven teeth",
      "Ultra-thin — minimal tooth preparation",
      "Stain-resistant porcelain material",
      "Natural-looking, long-lasting results",
    ],
  },
  // Draft copy — needs Dr. Ava's clinical review
  "snap-on-dentures": {
    tagline: "Secure, Removable Implant Dentures",
    body: [
      "Snap-on dentures — also called implant-retained overdentures — are removable dentures that attach to a small number of dental implants. Fittings inside the denture snap onto attachments on the implants, such as locator attachments, holding your teeth securely in place while you eat, speak, and smile.",
      "Because they're anchored to implants, snap-on dentures are typically more stable than traditional dentures that rest on the gums alone, and you can unsnap them each day for easy cleaning. They often require fewer implants than a fixed full arch, which can lower the overall cost, and they may be an option when jawbone is limited. During your consultation, our team will help you decide which approach is right for you.",
    ],
    benefits: [
      "More stable than a traditional denture",
      "Snaps securely onto dental implants",
      "Removable for easy daily cleaning",
      "Often requires fewer implants than a fixed full arch",
      "May be an option when jawbone is limited",
    ],
  },
  consultation: {
    tagline: "Your Journey Starts Here",
    body: [
      "Every great smile transformation begins with a conversation. During your free consultation, our team will perform a comprehensive examination, take 3D CT scans of your jaw, and discuss your goals and concerns.",
      "You'll receive a personalized treatment plan with clear options, a full cost breakdown, and information about financing. There's absolutely no obligation — just expert guidance to help you make the best decision for your smile.",
    ],
    benefits: [
      "Comprehensive dental examination",
      "Advanced 3D CT imaging",
      "Personalized treatment plan",
      "Clear cost breakdown and financing options",
      "No obligation whatsoever",
    ],
  },
};

const services = SERVICES.map((service) => ({
  ...service,
  ...SERVICE_DETAILS[service.id],
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
