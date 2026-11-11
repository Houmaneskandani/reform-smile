import { readConsent } from "@/components/CookieConsent";

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

export function trackEvent(event: EventName, data?: EventData) {
  if (typeof window === "undefined") return;

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
