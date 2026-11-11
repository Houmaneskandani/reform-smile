import { SITE_CONFIG } from "./constants";
import { trackEvent } from "./tracking";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const REQUEST_TIMEOUT_MS = 15_000;

const SUCCESS_MESSAGE = "Form submitted successfully";
const UNAVAILABLE_MESSAGE = `Online requests are temporarily unavailable. Please call us at ${SITE_CONFIG.phone} and we'll get you scheduled.`;
const SEND_FAILED_MESSAGE = `We couldn't send your request. Please try again, or call us at ${SITE_CONFIG.phone}.`;
const NETWORK_ERROR_MESSAGE = `We couldn't reach our server. Please check your connection and try again, or call us at ${SITE_CONFIG.phone}.`;
const TIMEOUT_MESSAGE = `This is taking longer than expected, and your request may still have gone through. To avoid sending it twice, please call us at ${SITE_CONFIG.phone} to confirm.`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Sends a website form to the practice inbox via Web3Forms.
 *
 * Resolves with `success: true` only when Web3Forms confirms the message was accepted
 * (or, in local development without a key, in demo mode). Never throws — on any failure
 * it resolves with `success: false` and a patient-facing `message` to show in the form.
 *
 * Conversion events (consultation_booked / form_submitted) fire only after a confirmed send.
 */
export async function submitForm(
  data: Record<string, string>,
  formName: string
): Promise<{ success: boolean; message: string }> {
  const { botcheck, ...fields } = data;

  // Spam honeypot: people never see the hidden "botcheck" field, so a value in it means
  // a bot filled the form. Report success so the bot moves on, but send and track nothing.
  if (botcheck) {
    return { success: true, message: SUCCESS_MESSAGE };
  }

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

  // Confirmed delivery — only now count it as a conversion. Never put the patient's
  // details in tracking data; the form name is enough.
  const eventName = formName.toLowerCase().includes("consult")
    ? "consultation_booked"
    : "form_submitted";
  trackEvent(eventName, { form: formName });

  return { success: true, message: SUCCESS_MESSAGE };
}
