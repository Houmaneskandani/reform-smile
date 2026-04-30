export const SITE_CONFIG = {
  name: "Reform Smile & Dental Implant Center",
  shortName: "Reform Smile",
  doctor: "Dr. Ava Pournejad, DDS",
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
    instagram: "#", // TODO: Add real links
    facebook: "#",
    youtube: "#",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICES = [
  {
    title: "All-on-4 Dental Implants",
    description:
      "A full arch of beautiful, permanent teeth supported by just four strategically placed implants. Restore your smile in a single day.",
    icon: "implant" as const,
  },
  {
    title: "All-on-6 Dental Implants",
    description:
      "Six implants provide enhanced stability and support for a complete arch restoration, ideal for patients who need extra strength.",
    icon: "implant" as const,
  },
  {
    title: "Full Arch Restoration",
    description:
      "Complete smile transformation for patients with multiple missing teeth. A permanent, natural-looking solution that changes lives.",
    icon: "arch" as const,
  },
  {
    title: "Teeth-in-a-Day",
    description:
      "Walk in with missing or failing teeth and walk out with a brand new smile — all in a single appointment.",
    icon: "clock" as const,
  },
  {
    title: "Bone Grafting",
    description:
      "Advanced bone regeneration procedures to build a strong foundation for dental implants, even when bone loss has occurred.",
    icon: "bone" as const,
  },
  {
    title: "Free Consultation",
    description:
      "Meet Dr. Pournejad for a comprehensive evaluation, 3D imaging, and a personalized treatment plan — at no cost to you.",
    icon: "consultation" as const,
  },
] as const;
