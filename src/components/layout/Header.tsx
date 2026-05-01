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
            className={`lg:hidden p-2 cursor-pointer transition-colors relative z-[60] ${
              mobileMenuOpen ? "text-white" : isTransparent ? "text-white" : "text-navy"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[55] lg:hidden transition-all duration-500 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Navy background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark via-navy to-navy-light" />

        {/* Decorative gold accent */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold/5 blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gold/5 blur-[60px]" />

        {/* Menu content */}
        <div className="relative h-full flex flex-col justify-center px-10">
          {/* Nav links — large, staggered */}
          <nav className="space-y-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-4 transition-all duration-500 ${
                  mobileMenuOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-[-30px]"
                }`}
                style={{ transitionDelay: mobileMenuOpen ? `${150 + i * 80}ms` : "0ms" }}
              >
                <span className="text-white/30 text-xs font-mono mr-4">
                  0{i + 1}
                </span>
                <span className="text-white text-2xl font-heading hover:text-gold transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div
            className={`w-12 h-px bg-gold/40 my-10 transition-all duration-500 ${
              mobileMenuOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            style={{ transitionDelay: mobileMenuOpen ? "600ms" : "0ms" }}
          />

          {/* CTA area */}
          <div
            className={`space-y-5 transition-all duration-500 ${
              mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
            }`}
            style={{ transitionDelay: mobileMenuOpen ? "700ms" : "0ms" }}
          >
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
              className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors"
            >
              <Phone size={18} className="text-gold" />
              <span className="text-lg">{SITE_CONFIG.phone}</span>
            </a>

            <Button
              href="/consultation"
              variant="gold"
              size="lg"
              className="w-full mt-4"
            >
              Free Consultation
            </Button>
          </div>

          {/* Bottom brand text */}
          <p
            className={`absolute bottom-10 left-10 text-white/15 text-xs tracking-[0.3em] uppercase transition-all duration-500 ${
              mobileMenuOpen ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: mobileMenuOpen ? "900ms" : "0ms" }}
          >
            Reform Smile & Dental Implant Center
          </p>
        </div>
      </div>
    </>
  );
}
