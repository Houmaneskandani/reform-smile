import { SERVICES, SITE_CONFIG } from "@/lib/constants";

// JSON-LD for Google (schema.org). The practice details, hours, social profiles and
// services are derived from src/lib/constants.ts so they always match what the site shows.
// Only the "specializes in All-on-X full arch" lead-in of the description is fixed text.

const absoluteUrl = (path: string) => new URL(path, SITE_CONFIG.url).toString();

// "9:00 AM - 5:00 PM" -> { opens: "09:00", closes: "17:00" }; "Closed" (or anything
// unrecognised) -> null, so that day is simply left out.
function parseHours(range: string): { opens: string; closes: string } | null {
  const match = range.match(
    /^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*[-–—]\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i
  );
  if (!match) return null;
  const to24h = (hour: string, minute: string, period: string) => {
    const h = (Number(hour) % 12) + (period.toUpperCase() === "PM" ? 12 : 0);
    return `${String(h).padStart(2, "0")}:${minute}`;
  };
  return {
    opens: to24h(match[1], match[2], match[3]),
    closes: to24h(match[4], match[5], match[6]),
  };
}

const OPENING_DAYS = [
  {
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    hours: SITE_CONFIG.hours.weekdays,
  },
  { dayOfWeek: ["Saturday"], hours: SITE_CONFIG.hours.saturday },
  { dayOfWeek: ["Sunday"], hours: SITE_CONFIG.hours.sunday },
];

const openingHoursSpecification = OPENING_DAYS.flatMap(({ dayOfWeek, hours }) => {
  const parsed = parseHours(hours);
  return parsed ? [{ "@type": "OpeningHoursSpecification", dayOfWeek, ...parsed }] : [];
});

// Real profile URLs only — "#" placeholders are skipped. Share/tracking parameters
// (e.g. ?igsh=…&utm_source=qr) are stripped so Google sees the canonical profile URL;
// any other parameter is kept, since some profiles are identified by their query string
// (e.g. facebook.com/profile.php?id=…).
const TRACKING_PARAM = /^(utm_.+|igsh|igshid|si|fbclid|gclid|mibextid)$/i;

const sameAs = Object.values(SITE_CONFIG.social)
  .filter((href) => /^https?:\/\//.test(href))
  .map((href) => {
    const url = new URL(href);
    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAM.test(key)) url.searchParams.delete(key);
    }
    url.hash = "";
    return url.toString();
  });

// Treatments only — the free consultation is not a procedure.
const treatments = SERVICES.filter((service) => service.id !== "consultation");

// "single dental implants, dental veneers, and snap-on dentures" (full arch is the lead-in).
const otherTreatments = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
  treatments
    .filter((service) => service.id !== "full-arch")
    .map((service) => service.title.toLowerCase())
);

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    // Dentist for local search; MedicalClinic is what allows `availableService`.
    "@type": ["Dentist", "MedicalClinic"],
    "@id": absoluteUrl("/#practice"),
    name: SITE_CONFIG.name,
    description: `${SITE_CONFIG.name} specializes in All-on-X full arch dental implants${
      otherTreatments ? ` and also offers ${otherTreatments}` : ""
    }.`,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl("/og-image.jpg"),
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
    openingHoursSpecification,
    priceRange: "$$",
    medicalSpecialty: "Dentistry",
    availableService: treatments.map((service) => ({
      "@type": "MedicalProcedure",
      name: service.title,
      description: service.description,
      url: absoluteUrl(`/services#${service.id}`),
    })),
    ...(sameAs.length > 0 && { sameAs }),
    // No `founder` here: this JSON-LD is on every page, and Dr. Ava's name is
    // shown on the About page only (her request).
  };

  // Escape "<" so no value can close the <script> tag early (e.g. "</script>").
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
