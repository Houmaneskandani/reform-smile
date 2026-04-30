"use client";

import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

const latinTerms = [
  "Dens permanens", "Implantum titanicum", "Os alveolare", "Processus alveolaris",
  "Mandibula", "Maxilla", "Periodontium", "Gingiva", "Enamelum", "Dentinum",
  "Pulpa dentis", "Apex radicis", "Foramen apicale", "Ligamentum periodontale",
  "Cavitas oris", "Arcus dentalis", "Corona dentis", "Radix dentis",
  "Collum dentis", "Cementum",
];

export default function ClinicalFooter() {
  return (
    <footer className="bg-[#0F2440] text-white">
      {/* Latin terms marquee */}
      <div className="overflow-hidden py-6 border-b border-white/5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...latinTerms, ...latinTerms].map((term, i) => (
            <span
              key={i}
              className="mx-8 text-[10px] tracking-[0.3em] uppercase"
              style={{
                fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                color: "#C4A265",
                opacity: 0.25,
              }}
            >
              {term}
            </span>
          ))}
        </div>
      </div>

      {/* Footer content */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3
              className="text-xl tracking-[-0.02em] mb-4"
              style={{ fontFamily: "var(--font-heading)", color: "#ffffff" }}
            >
              Reform Smile
            </h3>
            <p className="text-[13px] leading-relaxed text-white/40">
              & Dental Implant Center
            </p>
            <p className="text-[13px] leading-relaxed mt-4 text-[#C4A265]">
              Dr. Ava Pournejad, DDS
            </p>
          </div>

          {/* Contact */}
          <div>
            <span
              className="text-[10px] tracking-[0.3em] uppercase block mb-6"
              style={{
                fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                color: "#C4A265",
              }}
            >
              Contact
            </span>
            <div className="space-y-3 text-[13px] text-white/40">
              <p>{SITE_CONFIG.phone}</p>
              <p>{SITE_CONFIG.email}</p>
              <p>
                {SITE_CONFIG.address}<br />
                {SITE_CONFIG.city}, {SITE_CONFIG.state} {SITE_CONFIG.zip}
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <span
              className="text-[10px] tracking-[0.3em] uppercase block mb-6"
              style={{
                fontFamily: '"JetBrains Mono", "SF Mono", monospace',
                color: "#C4A265",
              }}
            >
              Navigation
            </span>
            <div className="space-y-3 text-[13px] text-white/40">
              <Link href="/about" className="block hover:text-[#C4A265] transition-colors">About</Link>
              <Link href="/services" className="block hover:text-[#C4A265] transition-colors">Services</Link>
              <Link href="/gallery" className="block hover:text-[#C4A265] transition-colors">Gallery</Link>
              <Link href="/consultation" className="block hover:text-[#C4A265] transition-colors">Book Consultation</Link>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center">
          <p className="text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} Reform Smile & Dental Implant Center
          </p>
          <p
            className="text-[9px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: '"JetBrains Mono", "SF Mono", monospace',
              color: "#C4A265",
              opacity: 0.3,
            }}
          >
            Engineered for permanence
          </p>
        </div>
      </div>
    </footer>
  );
}
