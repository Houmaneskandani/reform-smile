"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { practice } from "@/content";
import { telHref } from "@/content/format";
import Button from "@/components/ui/Button";

const PHONE_HREF = telHref(SITE_CONFIG.phone);

// On the homepage the header turns from transparent to solid white past this point.
const SCROLL_THRESHOLD = 50;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getIsScrolled = () => window.scrollY > SCROLL_THRESHOLD;
// The server can't know the scroll position, so it renders the top-of-page state.
const getIsScrolledOnServer = () => false;

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getIsScrolled,
    getIsScrolledOnServer
  );
  const pathname = usePathname();

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Hide header entirely on consultation landing page (it has its own).
  // This must stay below every hook so the hooks run in the same order on each render.
  if (pathname === "/consultation") return null;

  // Only do the transparent->solid transition on the homepage
  const isTransparent = pathname === "/" && !scrolled;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Top bar */}
      <div className="bg-navy text-white text-sm py-2.5 hidden md:block relative z-50">
        <div className="section-container flex justify-between items-center gap-6">
          {/* Edited in content/practice.json */}
          <p className="text-white/80 truncate">{practice.topBarTagline}</p>
          <a
            href={PHONE_HREF}
            className="flex items-center gap-2 whitespace-nowrap hover:text-gold-ink transition-colors"
          >
            <Phone size={14} aria-hidden="true" />
            <span>{SITE_CONFIG.phone}</span>
          </a>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isTransparent ? "on-dark bg-transparent" : "bg-white shadow-lg"
        }`}
      >
        <div className="section-container flex items-center justify-between gap-6 h-20 md:h-24">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex-shrink-0 relative z-50"
          >
            {/* White logo — only visible on homepage when not scrolled.
                Empty alt: it duplicates the color logo, which names the link once. */}
            <Image
              src="/logo-header-white.png"
              alt=""
              width={340}
              height={320}
              sizes="96px"
              priority
              className={`w-auto h-14 md:h-20 absolute top-1/2 -translate-y-1/2 left-0 transition-opacity duration-500 ${
                isTransparent ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
            {/* Color logo — visible on all other pages and when scrolled */}
            <Image
              src="/logo-header.png"
              alt="Reform Dental & Implant Center"
              width={340}
              height={320}
              sizes="96px"
              priority
              className={`w-auto h-14 md:h-20 transition-opacity duration-500 ${
                isTransparent ? "opacity-0" : "opacity-100"
              }`}
            />
          </Link>

          {/* Desktop Nav — from lg (tighter spacing until xl so everything stays on one line) */}
          <nav aria-label="Main" className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap font-medium transition-colors text-[13px] tracking-wider xl:tracking-widest uppercase ${
                    active
                      ? "text-gold-ink"
                      : isTransparent
                        ? "text-white/90 hover:text-gold-ink"
                        : "text-dark hover:text-gold-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 xl:gap-6 flex-shrink-0">
            {/* Phone + CTA from tablet up (phones get the sticky bottom bar). The phone is an
                icon until xl, then the full number. Between 1024px and 1100px the nav needs
                the room, so the phone is left to the top bar there. */}
            <a
              href={PHONE_HREF}
              aria-label={`Call us at ${SITE_CONFIG.phone}`}
              className={`hidden md:flex lg:max-[1100px]:hidden items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors w-10 h-10 rounded-full border xl:w-auto xl:h-auto xl:rounded-none xl:border-0 ${
                isTransparent
                  ? "text-white/90 hover:text-gold-ink border-white/30"
                  : "text-navy hover:text-gold-ink border-navy/15"
              }`}
            >
              <Phone size={16} aria-hidden="true" />
              <span className="hidden xl:inline text-sm">{SITE_CONFIG.phone}</span>
            </a>
            <div className="hidden md:block">
              <Button
                href="/consultation"
                variant="gold"
                size="sm"
                className="whitespace-nowrap"
              >
                Free Consultation
              </Button>
            </div>

            {/* Menu button — below lg */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 cursor-pointer transition-colors ${
                isTransparent ? "text-white" : "text-navy"
              }`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu overlay — click to close */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[-1] lg:hidden bg-black/20"
              onClick={closeMobileMenu}
            />
          )}
        </AnimatePresence>

        {/* Mobile menu — slides down with staggered items */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden bg-white border-t border-gray-lighter overflow-hidden"
            >
              <nav aria-label="Mobile" className="section-container flex flex-col py-6">
                {NAV_LINKS.map((link, i) => {
                  const active = isActiveLink(pathname, link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMobileMenu}
                        aria-current={active ? "page" : undefined}
                        className={`block py-3.5 font-medium hover:text-gold-ink transition-colors text-sm tracking-widest uppercase ${
                          i < NAV_LINKS.length - 1 ? "border-b border-gray-lighter" : ""
                        } ${active ? "text-gold-ink" : "text-dark"}`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                {/* Phone + CTA — tablets already show both in the header bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="pt-6 flex flex-col gap-4 md:hidden"
                >
                  <a
                    href={PHONE_HREF}
                    className="flex items-center justify-center gap-2 text-navy font-semibold py-3"
                  >
                    <Phone size={18} aria-hidden="true" />
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
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
