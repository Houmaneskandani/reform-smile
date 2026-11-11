export const SITE_CONFIG = {
  name: "Reform Smile & Dental Implant Center",
  shortName: "Reform Smile",
  doctor: "Dr. Ava, DDS", // Dr. Ava's request: show her name on the About page only
  // Public site address — used for SEO metadata, sitemap, robots.txt and structured data.
  // TODO: Switch to the custom domain once DNS points at Vercel.
  url: "https://ava-green.vercel.app",
  phone: "(555) 123-4567", // TODO: Replace with real phone number
  email: "info@reformsmile.com", // TODO: Replace with real email
  address: "123 Main Street, Suite 100", // TODO: Replace with real address
  city: "Los Angeles",
  state: "CA",
  zip: "90001",
  hours: {
    weekdays: "9:00 AM - 5:00 PM",
    saturday: "9:00 AM - 2:00 PM",
    sunday: "Closed",
  },
  social: {
    instagram: "https://www.instagram.com/reformdentalimplantcenter?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr",
    facebook: "#",
    youtube: "#",
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
// page, the booking form, structured data (Google) and the AI chat all read from here —
// add, remove or rename a service in this one place.
export const SERVICES = [
  {
    id: "full-arch",
    title: "Full Arch Dental Implants",
    description:
      "Complete smile restoration using the All-on-X technique. 4-6 strategically placed implants support an entire arch of permanent, beautiful teeth.",
  },
  {
    id: "single-implants",
    title: "Single Dental Implants",
    description:
      "Replace individual missing teeth with a titanium implant post and custom crown — looks and feels exactly like your natural tooth.",
  },
  {
    id: "veneers",
    title: "Dental Veneers",
    description:
      "Ultra-thin porcelain shells that transform the appearance of your teeth. Fix chips, stains, gaps, and uneven teeth for a flawless smile.",
  },
  {
    id: "snap-on-dentures",
    title: "Snap-On Dentures",
    description:
      "Removable implant-supported dentures that snap securely into place for improved stability, comfort, and confidence over traditional dentures.",
  },
  {
    id: "consultation",
    title: "Free Consultation",
    description:
      "A comprehensive evaluation with 3D imaging and a personalized treatment plan — at no cost to you.",
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];
