import { SITE_CONFIG } from "./constants";

// Shared by the browser (submitForm, the forms) and the server route /api/lead, which forwards
// the Contact, Book and Free Consultation forms to Marketing Ava (the practice's patient
// communication system). Contract: docs/WEBSITE-LEADS.md in the Marketing Ava repo.
// The forward is off unless all four MARKETING_AVA_* / AVA_FORM_ID_* variables are set
// (src/lib/server/lead-forwarding.ts); while it is off, none of this is used or shown.

export const LEAD_FORMS = ["contact", "book", "consultation"] as const;
export type LeadForm = (typeof LEAD_FORMS)[number];

export function isLeadForm(value: unknown): value is LeadForm {
  return typeof value === "string" && (LEAD_FORMS as readonly string[]).includes(value);
}

/**
 * The only form fields that ever go to Marketing Ava. Free text the patient typed (subject,
 * message, notes) is deliberately missing: the dashboard holds contact and scheduling details
 * only, never clinical details.
 */
export const LEAD_FIELDS: Record<LeadForm, readonly string[]> = {
  contact: ["name", "email", "phone"],
  book: [
    "firstName",
    "lastName",
    "email",
    "phone",
    "service",
    "preferredDate",
    "preferredTime",
    "isNewPatient",
  ],
  consultation: ["firstName", "lastName", "email", "phone", "concern"],
};

/**
 * Text-message consent, shown as an unticked, optional checkbox on the three forms while the
 * forward is on. Marketing Ava records this exact wording as version v1: if it ever changes,
 * tell the Marketing Ava session first so it can bump the version. Business name only, never
 * the doctor's name.
 */
export const SMS_CONSENT_VERSION = "v1";
export const SMS_CONSENT_TEXT = `Yes, I agree to receive text messages from ${SITE_CONFIG.name} about my appointment request, reminders and offers. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase.`;

/** First-touch attribution sent with a lead (see src/lib/leadSource.ts). */
export type LeadSource = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  page?: string;
};
