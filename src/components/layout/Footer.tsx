import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Camera, MessageCircle, Video } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { practice } from "@/content";
import { telHref } from "@/content/format";
import { CookieSettingsButton } from "@/components/CookieConsent";

// Only profiles with a real address are shown — placeholders ("#") would be dead links.
const SOCIAL_LINKS = [
  { label: "Instagram", href: SITE_CONFIG.social.instagram, icon: Camera },
  { label: "Facebook", href: SITE_CONFIG.social.facebook, icon: MessageCircle },
  { label: "YouTube", href: SITE_CONFIG.social.youtube, icon: Video },
].filter((link) => link.href && link.href !== "#");

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="section-container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/logo-white.png"
              alt={SITE_CONFIG.name}
              width={160}
              height={160}
              className="h-24 md:h-28 w-auto mb-4"
            />
            {/* Edited in content/practice.json */}
            <p className="text-white/70 text-sm leading-relaxed mt-4">
              {practice.footerBlurb}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-heading text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/book"
                  className="text-white/70 hover:text-gold transition-colors text-sm"
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gold font-heading text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <a
                  href={telHref(SITE_CONFIG.phone)}
                  className="text-white/70 hover:text-gold transition-colors text-sm"
                >
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-white/70 hover:text-gold transition-colors text-sm"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  {SITE_CONFIG.address}
                  <br />
                  {SITE_CONFIG.city}, {SITE_CONFIG.state} {SITE_CONFIG.zip}
                </span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-gold font-heading text-lg mb-6">Office Hours</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white/90 font-medium">Mon - Fri</p>
                  <p className="text-white/70">{SITE_CONFIG.hours.weekdays}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white/90 font-medium">Saturday</p>
                  <p className="text-white/70">{SITE_CONFIG.hours.saturday}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-gold mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white/90 font-medium">Sunday</p>
                  <p className="text-white/70">{SITE_CONFIG.hours.sunday}</p>
                </div>
              </li>
            </ul>

            {/* Social */}
            {SOCIAL_LINKS.length > 0 && (
              <div className="flex gap-4 mt-6">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Reform Smile on ${label} (opens in a new tab)`}
                    title={label}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* The year can differ between the prerendered page and the visitor's clock */}
          <p className="text-white/50 text-sm" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            {/* Lets visitors change or withdraw their cookie choice at any time */}
            <CookieSettingsButton className="text-white/50 hover:text-gold transition-colors text-sm cursor-pointer" />
            <p className="text-white/30 text-sm">
              Engineered with care
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
