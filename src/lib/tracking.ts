import { readConsent } from "@/components/CookieConsent";
import { sendSiteEvent } from "@/lib/analytics/client";

// Conversion tracking events
// These fire to Google Analytics, GTM, and Facebook Pixel when configured, and only
// after the visitor has accepted cookies. Never pass a patient's personal or health
// details (name, email, phone, messages, symptoms) in event data.

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

type EventName =
  | "quiz_started"
  | "quiz_completed"
  | "cost_estimator_started"
  | "cost_estimator_completed"
  | "form_submitted"
  | "consultation_booked"
  | "phone_clicked"
  | "chat_opened"
  | "chat_message_sent";

type EventData = Record<string, string | number | boolean>;

/**
 * The site's own anonymous statistics (no cookies, nothing personal; see
 * src/lib/analytics/client.ts). They don't depend on the cookie banner, unlike the
 * third-party tags below. A confirmed form send is recorded with the form's name only.
 */
function recordSiteEvent(event: EventName, data?: EventData) {
  if (event === "phone_clicked") return; // VisitorTracker already records every call link
  if (event === "form_submitted" || event === "consultation_booked") {
    sendSiteEvent({ type: "form_sent", target: typeof data?.form === "string" ? data.form : event });
    return;
  }
  // The quiz result and the estimator's procedure say which treatment was looked at.
  const detail = data?.result ?? data?.procedure;
  sendSiteEvent({ type: "action", target: event, label: typeof detail === "string" ? detail : undefined });
}

export function trackEvent(event: EventName, data?: EventData) {
  if (typeof window === "undefined") return;
  recordSiteEvent(event, data);

  // Tracking must never break the page or a form submission — e.g. reading
  // localStorage throws when the browser blocks site storage.
  try {
    // Only track if user accepted cookies
    // Same source of truth as the banner (also covers browsers that block storage)
    if (readConsent() !== "accepted") return;

    // Google Analytics / GTM
    if (window.gtag) {
      window.gtag("event", event, data);
    }

    // GTM dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({ event, ...data });
    }

    // Facebook Pixel
    if (window.fbq) {
      if (event === "consultation_booked" || event === "form_submitted") {
        window.fbq("track", "Lead", data);
      } else if (event === "quiz_completed" || event === "cost_estimator_completed") {
        window.fbq("track", "CompleteRegistration", data);
      } else if (event === "phone_clicked") {
        window.fbq("track", "Contact", data);
      }
    }
  } catch (error) {
    console.warn("[tracking] Could not record event:", event, error);
  }
}
