import { practice, services } from "@/content";
import { formatHours, socialHref } from "@/content/format";
import type { Service } from "@/content/schema";

export { SERVICE_IDS, type ServiceId } from "@/content/rules";

// Practice details. The name, short name, site address and keys stay here (developer-owned);
// phone, email, address, hours and social links are edited in content/practice.json through
// the website editor. Consumers keep reading SITE_CONFIG, so none of them had to change.
export const SITE_CONFIG = {
  name: "Reform Dental & Implant Center",
  shortName: "Reform Dental",
  // Public site address — used for SEO metadata, sitemap, robots.txt and structured data.
  url: "https://reformdentalimplantcenter.com",
  phone: practice.phone,
  email: practice.email,
  address: practice.address,
  city: practice.city,
  state: practice.state,
  zip: practice.zip,
  // Shown as "9:00 AM - 5:00 PM" or "Closed" (StructuredData relies on this format).
  hours: {
    weekdays: formatHours(practice.hours.weekdays),
    saturday: formatHours(practice.hours.saturday),
    sunday: formatHours(practice.hours.sunday),
  },
  // An empty link becomes "#", which the footer and structured data leave out.
  social: {
    instagram: socialHref(practice.social.instagram),
    facebook: socialHref(practice.social.facebook),
    youtube: socialHref(practice.social.youtube),
  },
  // Public keys loaded from environment variables (.env.local / Vercel project settings).
  // These are safe to expose in the browser. Secret keys (Anthropic, Twilio) must NEVER
  // use the NEXT_PUBLIC_ prefix — they are read only on the server (see src/app/api/).
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
  gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || "",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

// The single list of services the practice offers. The homepage cards, the Services
// page, the booking form, structured data (Google) and the AI chat all read from here.
// The ids are fixed in SERVICE_IDS (src/content/rules.ts); the titles, summaries and
// Services-page text are edited in content/services.json.
export const SERVICES: readonly Service[] = services.items;
