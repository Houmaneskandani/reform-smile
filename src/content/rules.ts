// Shared rules for the editable site content in /content/*.json.
// One source for the content schema (schema.ts), the website editor's field checks and the
// build-time content check, so the limits can't drift apart. Plain values only.
//
// This file is also bundled into the website editor's browser JavaScript (keystatic.config.ts
// imports it), so keep anything that must stay on the server out of it (see ./blocked.ts).

// ---------------------------------------------------------------------------
// Fixed structure (developer-owned)
// ---------------------------------------------------------------------------

/**
 * The services the practice offers, in display order. The ids are fixed in code: pages link
 * to /services#<id>, and icons and photos are looked up by id. The text for each service is
 * edited in content/services.json. To add a service, add its id here first.
 */
export const SERVICE_IDS = [
  "full-arch",
  "single-implants",
  "veneers",
  "snap-on-dentures",
  "consultation",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];

/** Where a patient review came from. */
export const TESTIMONIAL_SOURCES = ["google", "yelp", "in-person"] as const;

/**
 * Opening and closing times offered in the hours pickers: every half hour from 6:00 AM to
 * 9:00 PM, stored as 24-hour "HH:MM" (src/content/format.ts shows them as "9:00 AM").
 */
export const HALF_HOUR_TIMES = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
] as const;

export type HalfHourTime = (typeof HALF_HOUR_TIMES)[number];

// ---------------------------------------------------------------------------
// Formats
// ---------------------------------------------------------------------------

/** (555) 123-4567 */
export const PHONE_PATTERN = /^\(\d{3}\) \d{3}-\d{4}$/;
export const PHONE_MESSAGE = "Enter the phone number like this: (555) 123-4567";

/** name@example.com */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
export const EMAIL_MESSAGE = "Enter a full email address, like info@example.com";

/** Two capital letters, e.g. CA */
export const STATE_PATTERN = /^[A-Z]{2}$/;
export const STATE_MESSAGE = "Use the two-letter state code in capitals, like CA";

/** 90001 or 90001-1234 */
export const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;
export const ZIP_MESSAGE = "Enter a 5-digit ZIP code, like 90001";

/** Social profile links must be full https:// addresses. */
export const HTTPS_URL_MESSAGE = "Paste the full link, starting with https://";

// ---------------------------------------------------------------------------
// Length and number limits (sized to the page layouts)
// ---------------------------------------------------------------------------

export const LIMITS = {
  practice: {
    address: 100,
    city: 60,
    topBarTagline: 70,
    footerBlurb: 220,
  },
  pricing: {
    fullArchPerArch: { min: 1_000, max: 100_000 },
    singleImplant: { min: 500, max: 20_000 },
    boneGraft: { min: 100, max: 20_000 },
    offer: {
      eyebrow: 40,
      headline: 80,
      unitLabel: 20,
      body: 240,
      ctaLabel: 30,
    },
  },
  services: {
    title: 40,
    description: 220,
    tagline: 120,
    paragraph: 800,
    paragraphs: 4,
    benefit: 90,
    benefits: 8,
  },
  faq: {
    question: 140,
    // The accordion opens to the answer's measured height (FAQ.tsx), so this is about
    // readability, not space: 900 characters is about 36 lines on a 320px-wide phone.
    answer: 900,
  },
  testimonials: {
    displayName: 40,
    // Low on purpose: genuine reviews can be short ("Wonderful team, thank you!").
    quoteMin: 10,
    quoteMax: 400,
    shortQuote: 140,
    treatmentLabel: 40,
    rating: { min: 1, max: 5 },
  },
} as const;

// ---------------------------------------------------------------------------
// The doctor's name rule (see the content rules in CLAUDE.md)
// ---------------------------------------------------------------------------

/**
 * Matches text that does NOT contain the doctor's first name as a word. Used as a "must
 * match" pattern on every text field outside the About page, so the name can't be typed
 * into site-wide copy.
 */
export const NO_NAME = /^(?![\s\S]*\bava\b)[\s\S]*$/i;
export const NO_NAME_MESSAGE =
  "Use 'our doctor' or 'our team'. The doctor's name may appear only on the About page.";

// The surname is blocked by hash on the server only: see ./blocked.ts.
