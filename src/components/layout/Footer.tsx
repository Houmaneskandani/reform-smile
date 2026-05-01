import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle, Video } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main footer */}
      <div className="section-container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Reform Smile"
              width={160}
              height={53}
              className="h-16 w-auto brightness-0 invert mb-4"
            />
            <p className="text-white/70 text-sm leading-relaxed mt-4">
              Transforming lives through advanced dental implant solutions.
              Dr. Ava Pournejad and the Reform Smile team are dedicated to
              restoring your confidence with beautiful, permanent smiles.
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
                  href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
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
            <div className="flex gap-4 mt-6">
              <a
                href={SITE_CONFIG.social.instagram}
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
              >
                <Globe size={18} />
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={SITE_CONFIG.social.youtube}
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
              >
                <Video size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
          <p className="text-white/30 text-sm">
            Engineered with care
          </p>
        </div>
      </div>
    </footer>
  );
}
