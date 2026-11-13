// Shapes of the editable content files in /content (zod 4). They mirror exactly what the
// website editor writes: one JSON file per area, fields in the editor's order, and an empty
// optional field left out of the file (the editor never writes "" or null, but a hand-edited
// null is accepted too).
//
// Only TYPES from this file may be imported by components (`import type`), so zod never
// ships to the browser. The runtime check that parses the files runs during the build.

import { z } from "zod";
import {
  EMAIL_MESSAGE,
  EMAIL_PATTERN,
  HALF_HOUR_TIMES,
  HTTPS_URL_MESSAGE,
  LIMITS,
  NO_NAME,
  NO_NAME_MESSAGE,
  PHONE_MESSAGE,
  PHONE_PATTERN,
  SERVICE_IDS,
  STATE_MESSAGE,
  STATE_PATTERN,
  TESTIMONIAL_SOURCES,
  ZIP_MESSAGE,
  ZIP_PATTERN,
} from "./rules";

/** Site copy: never empty, length-limited, and free of the doctor's name. */
const copy = (max: number, min = 1) =>
  z
    .string()
    .min(min, min > 1 ? `Write at least ${min} characters` : "This field can't be empty")
    .max(max, `Keep this to ${max} characters or fewer`)
    .regex(NO_NAME, NO_NAME_MESSAGE);

/** Optional copy: left out of the file when empty. */
const optionalCopy = (max: number) => copy(max).nullish();

const wholeDollars = ({ min, max }: { min: number; max: number }) =>
  z
    .number()
    .int("Use whole dollars (no cents)")
    .min(min, `Must be at least $${min.toLocaleString("en-US")}`)
    .max(max, `Must be at most $${max.toLocaleString("en-US")}`);

const optionalHttpsUrl = z.url({ protocol: /^https$/, error: HTTPS_URL_MESSAGE }).nullish();
const optionalDate = z.iso.date({ error: "Use a real date, written like 2026-11-30" }).nullish();

const halfHourTime = z.enum(HALF_HOUR_TIMES, {
  error: "Choose a time on the hour or half hour, from 6:00 AM to 9:00 PM",
});

// ---------------------------------------------------------------------------
// content/practice.json
// ---------------------------------------------------------------------------

export const dayHoursSchema = z.strictObject({
  closed: z.boolean(),
  opens: halfHourTime,
  closes: halfHourTime,
});

export const practiceSchema = z.strictObject({
  phone: z.string().regex(PHONE_PATTERN, PHONE_MESSAGE),
  email: z.string().regex(EMAIL_PATTERN, EMAIL_MESSAGE).regex(NO_NAME, NO_NAME_MESSAGE),
  address: copy(LIMITS.practice.address),
  city: copy(LIMITS.practice.city),
  state: z.string().regex(STATE_PATTERN, STATE_MESSAGE),
  zip: z.string().regex(ZIP_PATTERN, ZIP_MESSAGE),
  hours: z.strictObject({
    weekdays: dayHoursSchema,
    saturday: dayHoursSchema,
    sunday: dayHoursSchema,
  }),
  // An empty link hides that icon in the footer.
  social: z.strictObject({
    instagram: optionalHttpsUrl,
    facebook: optionalHttpsUrl,
    youtube: optionalHttpsUrl,
  }),
  // The practice's Google review link. Empty = the /review page is a 404.
  googleReviewUrl: optionalHttpsUrl,
  topBarTagline: copy(LIMITS.practice.topBarTagline),
  footerBlurb: copy(LIMITS.practice.footerBlurb),
});

// ---------------------------------------------------------------------------
// content/pricing.json
// ---------------------------------------------------------------------------

export const offerSchema = z.strictObject({
  enabled: z.boolean(),
  eyebrow: copy(LIMITS.pricing.offer.eyebrow),
  headline: copy(LIMITS.pricing.offer.headline),
  unitLabel: copy(LIMITS.pricing.offer.unitLabel),
  body: copy(LIMITS.pricing.offer.body),
  ctaLabel: copy(LIMITS.pricing.offer.ctaLabel),
  // Last day of the offer (YYYY-MM-DD). Empty = no end date.
  endsOn: optionalDate,
});

export const pricingSchema = z.strictObject({
  fullArchPerArch: wholeDollars(LIMITS.pricing.fullArchPerArch),
  singleImplant: wholeDollars(LIMITS.pricing.singleImplant),
  // Empty = the chat says the cost varies and is discussed at the consultation.
  boneGraftMin: wholeDollars(LIMITS.pricing.boneGraft).nullish(),
  boneGraftMax: wholeDollars(LIMITS.pricing.boneGraft).nullish(),
  offer: offerSchema,
});

// ---------------------------------------------------------------------------
// content/services.json
// ---------------------------------------------------------------------------

export const serviceSchema = z.strictObject({
  // Hidden in the editor. A service that was deleted and added again has no id.
  id: z.enum(SERVICE_IDS, {
    error:
      "This service has lost its fixed id (this happens when a service is deleted and added again). Ask your developer to restore it.",
  }),
  title: copy(LIMITS.services.title),
  description: copy(LIMITS.services.description),
  tagline: copy(LIMITS.services.tagline),
  body: z
    .array(copy(LIMITS.services.paragraph))
    .min(1, "Write at least one paragraph")
    .max(LIMITS.services.paragraphs, `Use at most ${LIMITS.services.paragraphs} paragraphs`),
  benefits: z
    .array(copy(LIMITS.services.benefit))
    .max(LIMITS.services.benefits, `List at most ${LIMITS.services.benefits} benefits`),
  needsClinicalReview: z.boolean(),
});

export const servicesSchema = z.strictObject({
  items: z.array(serviceSchema),
});

// ---------------------------------------------------------------------------
// content/faq.json
// ---------------------------------------------------------------------------

export const faqItemSchema = z.strictObject({
  question: copy(LIMITS.faq.question),
  answer: copy(LIMITS.faq.answer),
});

export const faqSchema = z.strictObject({
  items: z.array(faqItemSchema),
});

// ---------------------------------------------------------------------------
// content/testimonials.json
// ---------------------------------------------------------------------------

const STAR_RATING_MESSAGE = `Choose from ${LIMITS.testimonials.rating.min} to ${LIMITS.testimonials.rating.max} stars`;

export const testimonialSchema = z.strictObject({
  displayName: copy(LIMITS.testimonials.displayName),
  quote: copy(LIMITS.testimonials.quoteMax, LIMITS.testimonials.quoteMin),
  // Shorter version for the consultation page; empty = use the full quote.
  shortQuote: optionalCopy(LIMITS.testimonials.shortQuote),
  // Shown under the name, e.g. "All-on-4 Dental Implants".
  treatmentLabel: copy(LIMITS.testimonials.treatmentLabel),
  // Shorter label for the consultation page; empty = use treatmentLabel.
  shortTreatmentLabel: optionalCopy(LIMITS.testimonials.treatmentLabel),
  service: z.enum(SERVICE_IDS, { error: "Choose the service the patient had" }),
  rating: z
    .number()
    .int(STAR_RATING_MESSAGE)
    .min(LIMITS.testimonials.rating.min, STAR_RATING_MESSAGE)
    .max(LIMITS.testimonials.rating.max, STAR_RATING_MESSAGE),
  source: z.enum(TESTIMONIAL_SOURCES, { error: "Choose where the review came from" }),
  date: optionalDate,
  permissionOnFile: z.boolean(),
  isSample: z.boolean(),
  showOnHome: z.boolean(),
  showOnConsultation: z.boolean(),
});

export const testimonialsSchema = z.strictObject({
  items: z.array(testimonialSchema),
});

/** Every content file and its schema, for the build-time check. */
export const contentSchemas = {
  practice: practiceSchema,
  pricing: pricingSchema,
  services: servicesSchema,
  faq: faqSchema,
  testimonials: testimonialsSchema,
} as const;

export type DayHours = z.infer<typeof dayHoursSchema>;
export type Practice = z.infer<typeof practiceSchema>;
export type Offer = z.infer<typeof offerSchema>;
export type Pricing = z.infer<typeof pricingSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type ServicesContent = z.infer<typeof servicesSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqContent = z.infer<typeof faqSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type TestimonialsContent = z.infer<typeof testimonialsSchema>;
