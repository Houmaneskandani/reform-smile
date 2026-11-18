import { SITE_CONFIG } from "./constants";
import { LEAD_FIELDS, SMS_CONSENT_VERSION, type LeadForm } from "./leads";
import { getLeadSource } from "./leadSource";
import { trackEvent } from "./tracking";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const REQUEST_TIMEOUT_MS = 15_000;
// /api/lead waits up to 5 s for Marketing Ava; this leaves room for the trip to our own server.
const LEAD_TIMEOUT_MS = 8_000;

const SUCCESS_MESSAGE = "Form submitted successfully";
const UNAVAILABLE_MESSAGE = `Online requests are temporarily unavailable. Please call us at ${SITE_CONFIG.phone} and we'll get you scheduled.`;
const SEND_FAILED_MESSAGE = `We couldn't send your request. Please try again, or call us at ${SITE_CONFIG.phone}.`;
const NETWORK_ERROR_MESSAGE = `We couldn't reach our server. Please check your connection and try again, or call us at ${SITE_CONFIG.phone}.`;
const TIMEOUT_MESSAGE = `This is taking longer than expected, and your request may still have gone through. To avoid sending it twice, please call us at ${SITE_CONFIG.phone} to confirm.`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

type FormResult = { success: boolean; message: string };
export type FormValues = Record<string, string | boolean | undefined>;

/**
 * Sends a website form to the practice: by email through Web3Forms and, for the Contact, Book
 * and Free Consultation forms while the lead forward is on (`options.lead`, set by the page),
 * also to Marketing Ava through /api/lead. Both run at the same time.
 *
 * Resolves with `success: true` when EITHER one confirms (or, in local development without a
 * Web3Forms key, in demo mode). A Marketing Ava failure never fails or delays the patient beyond
 * its timeout: the email is the backup. Never throws — on failure it resolves with
 * `success: false` and a patient-facing `message` to show in the form.
 *
 * Conversion events (consultation_booked / form_submitted) fire only after a confirmed send.
 */
export async function submitForm(
  data: FormValues,
  formName: string,
  options: { lead?: LeadForm } = {}
): Promise<FormResult> {
  const { botcheck, smsConsent, ...rest } = data;

  // Spam honeypot: people never see the hidden "botcheck" field, so a value in it means
  // a bot filled the form. Report success so the bot moves on, but send and track nothing
  // (neither the email nor Marketing Ava).
  if (botcheck) {
    return { success: true, message: SUCCESS_MESSAGE };
  }

  const fields: Record<string, string> = {};
  for (const [name, value] of Object.entries(rest)) {
    if (typeof value === "string") fields[name] = value;
  }
  const consented = smsConsent === true;

  const [email, leadAccepted] = await Promise.all([
    sendEmail(
      // The text-message box only exists while the forward is on; the email records the choice.
      options.lead
        ? { ...fields, "Text messages": consented ? `Agreed (consent ${SMS_CONSENT_VERSION})` : "Not agreed" }
        : fields,
      formName
    ),
    options.lead ? sendLead(options.lead, fields, consented, formName) : Promise.resolve(false),
  ]);

  if (!email.success && !leadAccepted) return email;

  // Confirmed delivery — only now count it as a conversion. Never put the patient's
  // details in tracking data; the form name is enough.
  const eventName = formName.toLowerCase().includes("consult")
    ? "consultation_booked"
    : "form_submitted";
  trackEvent(eventName, { form: formName });

  return leadAccepted && !email.success ? { success: true, message: SUCCESS_MESSAGE } : email;
}

/**
 * Forwards the form's contact and scheduling fields (never its free text) to /api/lead.
 * Resolves true only when Marketing Ava accepted the lead. Never throws, and logs the form name
 * and status code only.
 */
async function sendLead(
  form: LeadForm,
  fields: Record<string, string>,
  smsConsent: boolean,
  formName: string
): Promise<boolean> {
  const leadFields: Record<string, string> = {};
  for (const name of LEAD_FIELDS[form]) {
    if (fields[name]) leadFields[name] = fields[name];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LEAD_TIMEOUT_MS);
  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ form, fields: leadFields, smsConsent, source: getLeadSource() }),
      signal: controller.signal,
    });
    const result: unknown = await response.json().catch(() => null);
    const accepted = response.ok && isRecord(result) && result.ok === true;
    if (!accepted) {
      console.warn(`[submitForm] Marketing Ava did not accept "${formName}" (HTTP ${response.status}).`);
    }
    return accepted;
  } catch {
    console.warn(
      controller.signal.aborted
        ? `[submitForm] Marketing Ava did not answer "${formName}" in time.`
        : `[submitForm] Could not reach /api/lead for "${formName}".`
    );
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

/** Sends the form to the practice inbox via Web3Forms. Never throws. */
async function sendEmail(fields: Record<string, string>, formName: string): Promise<FormResult> {
  const key = SITE_CONFIG.web3formsKey;

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[submitForm] NEXT_PUBLIC_WEB3FORMS_KEY is not set, so "${formName}" was NOT sent anywhere (demo mode, development only). Add the key to .env.local to send real submissions.`
      );
      return { success: true, message: "Form submitted (demo mode: nothing was sent)" };
    }

    console.error(
      `[submitForm] NEXT_PUBLIC_WEB3FORMS_KEY is missing in this production build, so "${formName}" could not be sent. Add it in the Vercel project settings and redeploy.`
    );
    return { success: false, message: UNAVAILABLE_MESSAGE };
  }

  // A form's own "subject" field (e.g. the Contact form) goes into the email subject line
  // instead of replacing it, so every email still says which form it came from.
  const subject = fields.subject
    ? `New ${formName}: ${fields.subject} — ${SITE_CONFIG.name}`
    : `New ${formName} — ${SITE_CONFIG.name}`;

  // The timer covers sending the request AND reading the reply, so a response that stalls
  // halfway can't leave the form stuck on "Sending…".
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  let result: unknown = null;
  try {
    response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        // Set after the form fields so a field can never override them.
        access_key: key,
        subject,
        from_name: SITE_CONFIG.name,
      }),
      signal: controller.signal,
    });

    try {
      result = await response.json();
    } catch (error) {
      // A timeout while reading the reply is handled in the outer catch. Anything else means
      // the body wasn't JSON (e.g. an HTML error page), which is treated as a failure below.
      if (controller.signal.aborted) throw error;
    }
  } catch (error) {
    // Our timer is the only thing that aborts the request, so an aborted signal means it timed
    // out. Web3Forms may still have received it, so ask the patient to call rather than resend.
    if (controller.signal.aborted) {
      console.error(
        `[submitForm] Web3Forms did not answer "${formName}" within ${REQUEST_TIMEOUT_MS / 1000}s; it may or may not have been sent.`
      );
      return { success: false, message: TIMEOUT_MESSAGE };
    }
    console.error(`[submitForm] Could not reach Web3Forms for "${formName}":`, error);
    return { success: false, message: NETWORK_ERROR_MESSAGE };
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok || !isRecord(result) || result.success !== true) {
    console.error(
      `[submitForm] Web3Forms did not accept "${formName}" (HTTP ${response.status}):`,
      isRecord(result) ? result.message : "no JSON response"
    );
    return { success: false, message: SEND_FAILED_MESSAGE };
  }

  return { success: true, message: SUCCESS_MESSAGE };
}
