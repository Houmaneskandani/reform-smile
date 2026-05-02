"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isConsultation = pathname === "/consultation";

  // Hide header entirely on consultation landing page (it has its own)
  if (isConsultation) return null;

  // Only do the transparent->solid transition on the homepage
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-navy text-white text-sm py-2.5 hidden md:block relative z-50">
        <div className="section-container flex justify-between items-center">
          <p className="text-white/80">
            Transforming Smiles with All-on-X Dental Implants
          </p>
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <Phone size={14} />
            <span>{SITE_CONFIG.phone}</span>
          </a>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isTransparent ? "bg-transparent" : "bg-white shadow-lg"
        }`}
      >
        <div className="section-container flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative z-50">
            {/* White logo — only visible on homepage when not scrolled */}
            <Image
              src="/logo-white.png"
              alt="Reform Smile & Dental Implant Center"
              width={320}
              height={320}
              priority
              className={`w-auto h-16 md:h-32 absolute top-1/2 -translate-y-1/2 left-0 transition-opacity duration-500 ${
                isTransparent ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
            {/* Color logo — visible on all other pages and when scrolled */}
            <Image
              src="/logo-transparent.png"
              alt="Reform Smile & Dental Implant Center"
              width={320}
              height={320}
              priority
              className={`w-auto h-16 md:h-32 transition-opacity duration-500 ${
                isTransparent ? "opacity-0" : "opacity-100"
              }`}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors text-[13px] tracking-widest uppercase ${
                  isTransparent
                    ? "text-white/90 hover:text-gold"
                    : "text-dark hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Phone */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
              className={`flex items-center gap-2 font-semibold transition-colors ${
                isTransparent
                  ? "text-white/90 hover:text-gold"
                  : "text-navy hover:text-gold"
              }`}
            >
              <Phone size={16} />
              <span className="text-sm">{SITE_CONFIG.phone}</span>
            </a>
            <Button href="/consultation" variant="gold" size="sm">
              Free Consultation
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 cursor-pointer transition-colors ${
              isTransparent ? "text-white" : "text-navy"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu overlay — click to close */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-[-1] lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-lighter">
            <nav className="flex flex-col px-8 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3.5 text-dark font-medium hover:text-gold transition-colors text-sm tracking-widest uppercase border-b border-gray-lighter last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 flex flex-col gap-4">
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center justify-center gap-2 text-navy font-semibold py-3"
                >
                  <Phone size={18} />
                  <span>{SITE_CONFIG.phone}</span>
                </a>
                <Button
                  href="/consultation"
                  variant="gold"
                  size="md"
                  className="w-full"
                >
                  Free Consultation
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
