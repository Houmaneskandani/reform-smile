import { SITE_CONFIG } from "@/lib/constants";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: SITE_CONFIG.name,
    description:
      "Dr. Ava Pournejad specializes in All-on-X dental implants and full arch restorations at Reform Smile & Dental Implant Center.",
    url: "https://reformsmile.com", // TODO: Update with real domain
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address,
      addressLocality: SITE_CONFIG.city,
      addressRegion: SITE_CONFIG.state,
      postalCode: SITE_CONFIG.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    image: "/og-image.jpg",
    priceRange: "$$",
    medicalSpecialty: "Dental Implants",
    availableService: [
      { "@type": "MedicalProcedure", name: "All-on-4 Dental Implants" },
      { "@type": "MedicalProcedure", name: "All-on-6 Dental Implants" },
      { "@type": "MedicalProcedure", name: "Teeth-in-a-Day" },
      { "@type": "MedicalProcedure", name: "Bone Grafting" },
      { "@type": "MedicalProcedure", name: "Full Mouth Reconstruction" },
    ],
    founder: {
      "@type": "Person",
      name: "Dr. Ava Pournejad",
      jobTitle: "DDS",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
