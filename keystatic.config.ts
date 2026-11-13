// The website editor (Keystatic) at /keystatic. It edits the five files in content/ that the
// public site reads (src/content/index.ts). Every field below writes exactly the shape that
// src/content/schema.ts expects, in the same key order, and empty optional fields are left out.
//
// Storage:
// - Local (`npm run dev:admin`, then http://127.0.0.1:3000/keystatic): Save writes
//   content/*.json on this computer. No account needed. Commit and push to publish.
// - Keystatic Cloud (when NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT is set, e.g. "team/project"):
//   Save commits to GitHub and Vercel rebuilds the site. Without that variable, /keystatic
//   returns 404 in production (src/app/keystatic/layout.tsx).
//
// Checks here run in the editor before Save. The same rules (and a few that compare fields
// with each other) run again during the build in src/content/validate.ts.

import { config, fields, singleton } from "@keystatic/core";
import { formatTime } from "./src/content/format";
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
  STATE_MESSAGE,
  STATE_PATTERN,
  ZIP_MESSAGE,
  ZIP_PATTERN,
  type ServiceId,
} from "./src/content/rules";

const cloudProject = process.env.NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT;

/**
 * Said once at the top of each page of the editor. A few rules (listed in the field
 * descriptions) are only checked when the website is rebuilt after Save, and a change that
 * breaks one is not published: the live site keeps its last good version.
 */
const SAVE_NOTE = cloudProject
  ? "Changes go live on the website about 2–3 minutes after you click Save. If a change isn't live after about 5 minutes, the website's final check found a problem in it, and nothing you saved since goes live either: tell your developer."
  : "Local editing: Save writes the file in content/ on this computer. Run npm run build (it lists anything the final check rejects), then commit and push to publish.";

/**
 * Said on the pages that are lists. The editor checks every item before saving, but an item's
 * window can be closed with a broken field in it, and then Save silently does nothing. So the
 * list itself marks the item (see `flagged` below).
 */
const LIST_NOTE =
  "If Save does nothing, look for an item marked “⚠ Fix needed” in the list: open it, correct what the label says, click Done, then Save again.";

// ---------------------------------------------------------------------------
// List labels that point at the problem
// ---------------------------------------------------------------------------

type Text = string | null | undefined;

/** "doctor's name" if any of the texts breaks the name rule. */
const nameProblem = (...texts: Text[]) =>
  texts.some((text) => !!text && !NO_NAME.test(text)) ? "doctor's name" : null;

/** "empty field" / "too long" / "too short" for a text with these limits. */
function lengthProblem(text: Text, limits: { max: number; min?: number; required?: boolean }) {
  const length = text?.trim().length ?? 0;
  if (limits.required !== false && length === 0) return "empty field";
  if (length > limits.max) return "too long";
  if (limits.min !== undefined && length > 0 && length < limits.min) return "too short";
  return null;
}

/** The item's label in a list, with the first problem in front of it. */
function flagged(label: string, problems: (string | null)[]) {
  const problem = problems.find(Boolean);
  return problem ? `⚠ Fix needed (${problem}): ${label}` : label;
}

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

/** The name rule, with the general message or one written for the field. */
const nameRule = (message = NO_NAME_MESSAGE) => ({ regex: NO_NAME, message });

/** Required website text: never empty, length-limited, and without the doctor's name. */
function copy(
  label: string,
  max: number,
  description: string,
  options: { multiline?: boolean; min?: number; nameMessage?: string } = {}
) {
  return fields.text({
    label,
    description: `${description} Up to ${max} characters.`,
    multiline: options.multiline,
    validation: {
      isRequired: true,
      length: { min: options.min ?? 1, max },
      pattern: nameRule(options.nameMessage),
    },
  });
}

/** Optional website text: may be left empty (then it is left out of the file). */
function optionalCopy(
  label: string,
  max: number,
  description: string,
  options: { nameMessage?: string } = {}
) {
  return fields.text({
    label,
    description: `${description} Up to ${max} characters.`,
    validation: { length: { max }, pattern: nameRule(options.nameMessage) },
  });
}

// For patient reviews: the patient's words, with the doctor's name replaced.
const REVIEW_NAME_MESSAGE =
  "Replace the doctor's name with [our doctor], or choose another review. The name may appear only on the About page.";

/** Whole-dollar price, typed without "$" or commas. */
function price(
  label: string,
  limits: { min: number; max: number },
  description: string
) {
  return fields.integer({
    label,
    description,
    validation: { isRequired: true, min: limits.min, max: limits.max },
  });
}

const TIME_OPTIONS = HALF_HOUR_TIMES.map((value) => ({ label: formatTime(value), value }));

/** Opening hours for one day (or group of days). */
function dayHours(label: string) {
  return fields.object(
    {
      closed: fields.checkbox({
        label: "Closed all day",
        description: "When ticked, the website shows “Closed” and the times below are ignored.",
      }),
      opens: fields.select({ label: "Opens at", options: TIME_OPTIONS, defaultValue: "09:00" }),
      closes: fields.select({
        label: "Closes at",
        description: "Must be later than the opening time.",
        options: TIME_OPTIONS,
        defaultValue: "17:00",
      }),
    },
    { label }
  );
}

/**
 * Optional https:// link; an empty link hides that icon on the website. Links are shown on
 * every page, so they also follow the name rule (the build checks every value).
 */
function socialLink(label: string) {
  return fields.text({
    label,
    description: `Paste the full address of your ${label} page, starting with https://. Leave empty to hide the ${label} icon.`,
    validation: {
      pattern: {
        regex: allOf(/^(https:\/\/\S+)?$/, NO_NAME),
        message: `${HTTPS_URL_MESSAGE}. It can't include the doctor's name, because it is shown on every page.`,
      },
    },
  });
}

/**
 * A pattern that matches only when both whole-string patterns (^...$) match. Keystatic takes
 * one pattern per field; the email and the social links need their format and the name rule.
 */
function allOf(a: RegExp, b: RegExp): RegExp {
  return new RegExp(`(?=${a.source})(?=${b.source})`, "i");
}

// The email is shown on every page, so it also follows the name rule.
const EMAIL_WITHOUT_NAME = allOf(EMAIL_PATTERN, NO_NAME);

// Labels for the service pickers. The ids are fixed in src/content/rules.ts; the names the
// website shows are edited on the Services page of the editor.
const SERVICE_LABELS: Record<ServiceId, string> = {
  "full-arch": "Full arch implants (All-on-X)",
  "single-implants": "Single implants",
  veneers: "Veneers",
  "snap-on-dentures": "Snap-on dentures",
  consultation: "Free consultation",
};
const SERVICE_OPTIONS = (Object.keys(SERVICE_LABELS) as ServiceId[]).map((value) => ({
  label: SERVICE_LABELS[value],
  value,
}));

// ---------------------------------------------------------------------------
// The editor
// ---------------------------------------------------------------------------

export default config({
  storage: cloudProject ? { kind: "cloud" } : { kind: "local" },
  cloud: cloudProject ? { project: cloudProject } : undefined,
  ui: {
    brand: { name: "Reform Dental website editor" },
    navigation: {
      Practice: ["practice", "pricing"],
      "Website text": ["services", "faq", "testimonials"],
    },
  },
  singletons: {
    // content/practice.json
    practice: singleton({
      label: "Practice info",
      path: "content/practice",
      format: { data: "json" },
      schema: {
        phone: fields.text({
          label: "Phone number",
          description: `Shown in the header, footer, contact page, booking pages and to Google. Write it like (555) 123-4567. ${SAVE_NOTE}`,
          validation: {
            isRequired: true,
            pattern: { regex: PHONE_PATTERN, message: PHONE_MESSAGE },
          },
        }),
        email: fields.text({
          label: "Email address",
          description:
            "Shown on the contact page and in the footer. Use a practice address (it appears on every page), not a personal one.",
          validation: {
            isRequired: true,
            pattern: {
              regex: EMAIL_WITHOUT_NAME,
              message: `${EMAIL_MESSAGE}. It can't include the doctor's name, because it is shown on every page.`,
            },
          },
        }),
        address: copy(
          "Street address",
          LIMITS.practice.address,
          "Street and suite, e.g. 123 Main Street, Suite 100. Shown on the contact page, in the footer, on the map and to Google."
        ),
        city: copy("City", LIMITS.practice.city, "The city of the practice."),
        state: fields.text({
          label: "State",
          description: "Two capital letters, e.g. CA.",
          validation: {
            isRequired: true,
            pattern: { regex: STATE_PATTERN, message: STATE_MESSAGE },
          },
        }),
        zip: fields.text({
          label: "ZIP code",
          description: "Five digits, e.g. 90001.",
          validation: {
            isRequired: true,
            pattern: { regex: ZIP_PATTERN, message: ZIP_MESSAGE },
          },
        }),
        hours: fields.object(
          {
            weekdays: dayHours("Monday to Friday"),
            saturday: dayHours("Saturday"),
            sunday: dayHours("Sunday"),
          },
          {
            label: "Opening hours",
            description:
              "Shown in the footer and on the contact page, and given to Google. Monday to Friday share one set of hours; if some weekdays have different hours (for example Friday closed), ask your developer first.",
          }
        ),
        social: fields.object(
          {
            instagram: socialLink("Instagram"),
            facebook: socialLink("Facebook"),
            youtube: socialLink("YouTube"),
          },
          { label: "Social media links", description: "The icons in the footer." }
        ),
        topBarTagline: copy(
          "Top bar tagline",
          LIMITS.practice.topBarTagline,
          "The short line in the thin bar at the very top of every page."
        ),
        footerBlurb: copy(
          "Footer text",
          LIMITS.practice.footerBlurb,
          "The short paragraph under the logo at the bottom of every page.",
          { multiline: true }
        ),
      },
    }),

    // content/pricing.json
    pricing: singleton({
      label: "Prices & offer",
      path: "content/pricing",
      format: { data: "json" },
      schema: {
        fullArchPerArch: price(
          "Full arch price (per arch)",
          LIMITS.pricing.fullArchPerArch,
          `In whole dollars, without "$" or commas (for example 9000). Used by the cost estimator (for full arch implants and full arch veneers), the limited-time offer and the chat assistant. ${SAVE_NOTE}`
        ),
        singleImplant: price(
          "Single implant price",
          LIMITS.pricing.singleImplant,
          `In whole dollars, without "$" or commas (for example 2700). Used by the cost estimator and the chat assistant.`
        ),
        boneGraftMin: fields.integer({
          label: "Bone graft price: from",
          description:
            "Optional. Lowest typical bone graft cost in whole dollars. If both bone graft prices are empty, the chat assistant says the cost is discussed at the consultation.",
          validation: { min: LIMITS.pricing.boneGraft.min, max: LIMITS.pricing.boneGraft.max },
        }),
        boneGraftMax: fields.integer({
          label: "Bone graft price: up to",
          description:
            "Optional. Highest typical bone graft cost in whole dollars. Must not be lower than the \"from\" price.",
          validation: { min: LIMITS.pricing.boneGraft.min, max: LIMITS.pricing.boneGraft.max },
        }),
        offer: fields.object(
          {
            enabled: fields.checkbox({
              label: "Show the offer on the homepage",
              description:
                "Untick to hide the offer box on the homepage; the chat assistant then stops calling the price a limited-time offer. The full arch price itself doesn't change: the cost estimator and the chat keep quoting it. If the offer price was temporary, change the full arch price above too.",
            }),
            eyebrow: copy(
              "Small heading",
              LIMITS.pricing.offer.eyebrow,
              "The small gold text above the headline, e.g. Limited Time Offer."
            ),
            headline: copy("Headline", LIMITS.pricing.offer.headline, "The large headline of the offer."),
            unitLabel: copy(
              "Price label",
              LIMITS.pricing.offer.unitLabel,
              "Shown next to the full arch price, e.g. Per Arch."
            ),
            body: copy(
              "Description",
              LIMITS.pricing.offer.body,
              "One or two sentences under the price.",
              { multiline: true }
            ),
            ctaLabel: copy("Button text", LIMITS.pricing.offer.ctaLabel, "The text on the offer's button."),
            endsOn: fields.date({
              label: "Last day of the offer",
              description:
                "Optional. Visitors stop seeing the offer automatically after this day (California time); it leaves the page's code (what search engines read) with the next Save of any page. Like unticking the offer, this doesn't change the full arch price. Leave empty for no end date.",
            }),
          },
          {
            label: "Limited-time offer (homepage)",
            description: "The offer box on the homepage. Its price is the full arch price above.",
          }
        ),
      },
    }),

    // content/services.json
    services: singleton({
      label: "Services",
      path: "content/services",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            // Fixed in code (pages link to /services#<id>); kept as-is and not shown.
            id: fields.ignored(),
            title: copy(
              "Name",
              LIMITS.services.title,
              "The name of the service on the homepage, the Services page and in the booking form."
            ),
            description: copy(
              "Short summary",
              LIMITS.services.description,
              "One or two sentences for the service card on the homepage.",
              { multiline: true }
            ),
            tagline: copy(
              "Services page subheading",
              LIMITS.services.tagline,
              "The gold line above the paragraphs on the Services page."
            ),
            body: fields.array(
              copy(
                "Paragraph",
                LIMITS.services.paragraph,
                "One paragraph of the Services page.",
                { multiline: true }
              ),
              {
                label: "Services page paragraphs",
                description: `Between 1 and ${LIMITS.services.paragraphs} paragraphs.`,
                itemLabel: (props) =>
                  flagged(props.value || "New paragraph", [
                    nameProblem(props.value),
                    lengthProblem(props.value, { max: LIMITS.services.paragraph }),
                  ]),
                validation: { length: { min: 1, max: LIMITS.services.paragraphs } },
              }
            ),
            benefits: fields.array(
              copy("Benefit", LIMITS.services.benefit, "One short point in the list of benefits."),
              {
                label: "Benefits",
                description: `Up to ${LIMITS.services.benefits} short points, shown as a checklist.`,
                itemLabel: (props) =>
                  flagged(props.value || "New benefit", [
                    nameProblem(props.value),
                    lengthProblem(props.value, { max: LIMITS.services.benefit }),
                  ]),
                validation: { length: { max: LIMITS.services.benefits } },
              }
            ),
            needsClinicalReview: fields.checkbox({
              label: "Text still needs clinical review",
              description: "A reminder for the team. It is not shown on the website.",
            }),
          }),
          {
            label: "Services",
            description:
              `The five services are fixed: you can edit their text and drag to change their order, but keep Free Consultation last. Never delete a service and add it back: the new copy isn't linked to the website, and the website won't update until your developer fixes it (the same if Free Consultation isn't last). To add or remove a service, ask your developer. ${LIST_NOTE} ${SAVE_NOTE}`,
            itemLabel: (props) => {
              const { title, description, tagline, body, benefits } = props.fields;
              const paragraphs = body.elements.map((paragraph) => paragraph.value);
              const points = benefits.elements.map((benefit) => benefit.value);
              return flagged(title.value || "Service", [
                nameProblem(title.value, description.value, tagline.value, ...paragraphs, ...points),
                lengthProblem(title.value, { max: LIMITS.services.title }),
                lengthProblem(description.value, { max: LIMITS.services.description }),
                lengthProblem(tagline.value, { max: LIMITS.services.tagline }),
                ...paragraphs.map((text) => lengthProblem(text, { max: LIMITS.services.paragraph })),
                ...points.map((text) => lengthProblem(text, { max: LIMITS.services.benefit })),
                paragraphs.length === 0 ? "no paragraphs" : null,
                paragraphs.length > LIMITS.services.paragraphs ? "too many paragraphs" : null,
                points.length > LIMITS.services.benefits ? "too many benefits" : null,
              ]);
            },
            validation: { length: { min: 5, max: 5 } },
          }
        ),
      },
    }),

    // content/faq.json
    faq: singleton({
      label: "FAQ",
      path: "content/faq",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            question: copy(
              "Question",
              LIMITS.faq.question,
              "As patients would ask it."
            ),
            answer: copy(
              "Answer",
              LIMITS.faq.answer,
              "Shown when a visitor opens the question. Avoid promising results, and don't quote prices other than the ones on the “Prices & offer” page.",
              { multiline: true }
            ),
          }),
          {
            label: "Questions",
            description: `The frequently asked questions on the homepage. Drag to change the order. ${LIST_NOTE} ${SAVE_NOTE}`,
            itemLabel: (props) => {
              const { question, answer } = props.fields;
              return flagged(question.value || "New question", [
                nameProblem(question.value, answer.value),
                lengthProblem(question.value, { max: LIMITS.faq.question }),
                lengthProblem(answer.value, { max: LIMITS.faq.answer }),
              ]);
            },
          }
        ),
      },
    }),

    // content/testimonials.json
    testimonials: singleton({
      label: "Patient reviews",
      path: "content/testimonials",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            displayName: copy(
              "Patient name",
              LIMITS.testimonials.displayName,
              "First name and last initial only, e.g. Sarah M. If the patient has the doctor's first name, use initials instead, e.g. A. M.",
              {
                nameMessage:
                  "This is the doctor's first name, which may appear only on the About page. Use the patient's initials instead, e.g. A. M.",
              }
            ),
            quote: copy(
              "Review",
              LIMITS.testimonials.quoteMax,
              `The patient's own words, as written. If the review names the doctor (first or last name), replace the name with [our doctor], or choose another review. At least ${LIMITS.testimonials.quoteMin} characters.`,
              { multiline: true, min: LIMITS.testimonials.quoteMin, nameMessage: REVIEW_NAME_MESSAGE }
            ),
            shortQuote: optionalCopy(
              "Short version",
              LIMITS.testimonials.shortQuote,
              "Optional. For the consultation page: an exact excerpt of the review above, word for word (don't reword it). Leave empty to use the full review.",
              { nameMessage: REVIEW_NAME_MESSAGE }
            ),
            treatmentLabel: copy(
              "Treatment",
              LIMITS.testimonials.treatmentLabel,
              "Shown under the name on the homepage, e.g. All-on-4 Dental Implants."
            ),
            shortTreatmentLabel: optionalCopy(
              "Short treatment label",
              LIMITS.testimonials.treatmentLabel,
              "Optional. Shown on the consultation page, e.g. All-on-4 Patient. Leave empty to use the treatment above."
            ),
            service: fields.select({
              label: "Service",
              description: "Which service the patient had. Not shown on the website.",
              options: SERVICE_OPTIONS,
              defaultValue: "full-arch",
            }),
            rating: fields.integer({
              label: "Star rating",
              description: "From 1 to 5 stars.",
              defaultValue: 5,
              validation: {
                isRequired: true,
                min: LIMITS.testimonials.rating.min,
                max: LIMITS.testimonials.rating.max,
              },
            }),
            source: fields.select({
              label: "Where the review came from",
              options: [
                { label: "Google", value: "google" },
                { label: "Yelp", value: "yelp" },
                { label: "In person (written or recorded)", value: "in-person" },
              ],
              defaultValue: "google",
            }),
            date: fields.date({ label: "Date of the review", description: "Optional." }),
            permissionOnFile: fields.checkbox({
              label: "Patient's written permission is on file",
              description:
                "Required for every real review: tick it only when the practice has the patient's signed permission to publish it. Until it is ticked, a real review stays hidden on the website.",
            }),
            isSample: fields.checkbox({
              label: "This is a sample review (not a real patient)",
              description:
                "Sample reviews are marked as samples on the website. Replace them with real reviews as soon as you can.",
            }),
            showOnHome: fields.checkbox({
              label: "Show on the homepage",
              defaultValue: true,
            }),
            showOnConsultation: fields.checkbox({
              label: "Show on the consultation page",
              defaultValue: true,
            }),
          }),
          {
            label: "Reviews",
            description: `Shown on the homepage and the consultation page. Drag to change the order. A review is shown only if it is a sample or its "permission is on file" box is ticked, so a new review stays hidden until you tick one of them. ${LIST_NOTE} ${SAVE_NOTE}`,
            itemLabel: (props) => {
              const { displayName, quote, shortQuote, treatmentLabel, shortTreatmentLabel } =
                props.fields;
              const limits = LIMITS.testimonials;
              return flagged(displayName.value || "New review", [
                nameProblem(displayName.value, quote.value, shortQuote.value),
                nameProblem(treatmentLabel.value, shortTreatmentLabel.value),
                lengthProblem(displayName.value, { max: limits.displayName }),
                lengthProblem(quote.value, { max: limits.quoteMax, min: limits.quoteMin }),
                lengthProblem(shortQuote.value, { max: limits.shortQuote, required: false }),
                lengthProblem(treatmentLabel.value, { max: limits.treatmentLabel }),
                lengthProblem(shortTreatmentLabel.value, { max: limits.treatmentLabel, required: false }),
              ]);
            },
          }
        ),
      },
    }),
  },
});
