import "server-only";
import { LEAD_FIELDS, type LeadForm, type LeadSource } from "@/lib/leads";

// Server side of the lead forward to Marketing Ava (see src/lib/leads.ts and /api/lead).
// Off unless ALL four variables are set (server-only, no NEXT_PUBLIC_ prefix):
//   MARKETING_AVA_URL, AVA_FORM_ID_CONTACT, AVA_FORM_ID_BOOK, AVA_FORM_ID_CONSULTATION
// The pages read this at build time (they are prerendered), so a redeploy is needed after
// changing them. Setting only some of them, or a malformed value, stops the build with a
// message instead of half-switching the feature on.
//
// Switching it on is Houman's call: from then on real patient contact details are stored in the
// Marketing Ava database (HIPAA/BAA decision with the practice first).

const ENV_KEYS = {
  url: "MARKETING_AVA_URL",
  contact: "AVA_FORM_ID_CONTACT",
  book: "AVA_FORM_ID_BOOK",
  consultation: "AVA_FORM_ID_CONSULTATION",
} as const;

const FORM_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Marketing Ava's own phone rule; a number that fails it is left out (the lead still arrives by
// email, and through Web3Forms with the number as typed).
const AVA_PHONE = /^[+]?[\d\s()./-]{7,20}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const FORWARD_TIMEOUT_MS = 5_000;
const MAX_VALUE_LENGTH = 200;

export type LeadForwardingConfig = { baseUrl: string; formIds: Record<LeadForm, string> };

let cached: LeadForwardingConfig | null | undefined;

/** The forward's settings, or null when it is off. Throws on a half-set or malformed setup. */
export function getLeadForwardingConfig(): LeadForwardingConfig | null {
  if (cached !== undefined) return cached;

  const values = Object.fromEntries(
    Object.entries(ENV_KEYS).map(([key, name]) => [key, process.env[name]?.trim() ?? ""])
  ) as Record<keyof typeof ENV_KEYS, string>;

  const missing = Object.entries(ENV_KEYS)
    .filter(([key]) => !values[key as keyof typeof ENV_KEYS])
    .map(([, name]) => name);
  if (missing.length === Object.keys(ENV_KEYS).length) return (cached = null);
  if (missing.length > 0) {
    throw new Error(
      `Lead forwarding to Marketing Ava is half set up: ${missing.join(", ")} missing. Set all four variables to switch it on, or remove them all to keep it off.`
    );
  }

  let url: URL;
  try {
    url = new URL(values.url);
  } catch {
    throw new Error(`MARKETING_AVA_URL is not a valid address (expected https://…).`);
  }
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) {
    throw new Error(`MARKETING_AVA_URL must start with https:// (http is allowed for localhost testing only).`);
  }
  if (url.search || url.hash || url.username || url.password) {
    throw new Error(`MARKETING_AVA_URL must be a plain address like https://marketing.example.com.`);
  }

  for (const form of ["contact", "book", "consultation"] as const) {
    if (!FORM_ID.test(values[form])) {
      throw new Error(`${ENV_KEYS[form]} is not a Marketing Ava form id (expected a UUID).`);
    }
  }

  return (cached = {
    baseUrl: url.href.replace(/\/+$/, ""),
    formIds: { contact: values.contact, book: values.book, consultation: values.consultation },
  });
}

/** True when the forms should show the text-message box and send leads to Marketing Ava. */
export function leadForwardingEnabled(): boolean {
  return getLeadForwardingConfig() !== null;
}

/** "9:30 AM" → "Morning", "1:00 PM" → "Afternoon"; the three Marketing Ava values pass through. */
export function toTimeOfDay(value: string): "Morning" | "Afternoon" | "No preference" | undefined {
  if (value === "Morning" || value === "Afternoon" || value === "No preference") return value;
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value.trim());
  if (!match) return undefined;
  const hour = Number(match[1]);
  if (hour < 1 || hour > 12) return undefined;
  const pm = match[3].toUpperCase() === "PM";
  const hour24 = (hour % 12) + (pm ? 12 : 0);
  return hour24 < 12 ? "Morning" : "Afternoon";
}

function text(value: unknown, max = MAX_VALUE_LENGTH): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function cleanSource(source: unknown): LeadSource | undefined {
  if (typeof source !== "object" || source === null) return undefined;
  const raw = source as Record<string, unknown>;
  const clean: LeadSource = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const value = text(raw[key], 100);
    if (value) clean[key] = value;
  }
  const referrer = text(raw.referrer, 300);
  if (referrer) {
    try {
      const url = new URL(referrer);
      if (url.protocol === "https:" || url.protocol === "http:") clean.referrer = url.origin;
    } catch {
      // Not an address: left out.
    }
  }
  const page = text(raw.page, 300);
  if (page?.startsWith("/")) clean.page = page.split(/[?#]/)[0];
  return Object.keys(clean).length > 0 ? clean : undefined;
}

/**
 * Builds Marketing Ava's request body from what the browser sent: only the form's own listed
 * fields (never subject, message or notes), mapped to the values Marketing Ava accepts.
 * Returns null when the required email is missing.
 */
export function buildLeadBody(
  form: LeadForm,
  fields: Record<string, unknown>,
  smsConsent: boolean,
  source: unknown
): Record<string, unknown> | null {
  const body: Record<string, unknown> = {};
  for (const name of LEAD_FIELDS[form]) {
    const value = text(fields[name]);
    if (value !== undefined) body[name] = value;
  }
  if (typeof body.email !== "string") return null;

  if (typeof body.phone === "string" && !AVA_PHONE.test(body.phone)) delete body.phone;
  if (form === "book") {
    const time = typeof body.preferredTime === "string" ? toTimeOfDay(body.preferredTime) : undefined;
    if (time) body.preferredTime = time;
    else delete body.preferredTime;
    if (typeof body.preferredDate === "string" && !DATE.test(body.preferredDate)) delete body.preferredDate;
    if (body.isNewPatient !== "yes" && body.isNewPatient !== "no") delete body.isNewPatient;
  }
  // Consent only counts with a phone number to text; it is left out entirely otherwise.
  if (smsConsent && typeof body.phone === "string") body.sms_consent = true;

  const cleanedSource = cleanSource(source);
  if (cleanedSource) body._source = cleanedSource;
  return body;
}

/**
 * Sends one lead to Marketing Ava. Resolves with the HTTP status (201 = accepted), or 0 when
 * Marketing Ava could not be reached in time. Never throws and never logs field values.
 */
export async function forwardLead(
  config: LeadForwardingConfig,
  form: LeadForm,
  body: Record<string, unknown>
): Promise<number> {
  try {
    const response = await fetch(`${config.baseUrl}/api/forms/${config.formIds[form]}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
      redirect: "manual", // never follow a redirect to another address with patient details
      cache: "no-store",
    });
    let accepted = false;
    try {
      const result: unknown = await response.json();
      accepted =
        typeof result === "object" && result !== null && (result as { success?: unknown }).success === true;
    } catch {
      // Not JSON: not accepted.
    }
    return response.status === 201 && accepted ? 201 : response.status || 502;
  } catch {
    return 0;
  }
}
