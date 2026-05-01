"use client";

import { useState, useEffect } from "react";
import { Calendar, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function StickyBookNow() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-navy/95 backdrop-blur-md border-t border-gold/20 px-4 py-3 flex gap-3">
        <a
          href="/consultation"
          className="flex-1 flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold py-3.5 rounded-full transition-colors text-sm"
        >
          <Calendar size={16} />
          Book Free Consultation
        </a>
        <a
          href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
          className="flex items-center justify-center w-14 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          aria-label="Call us"
        >
          <Phone size={18} />
        </a>
      </div>
    </div>
  );
}
