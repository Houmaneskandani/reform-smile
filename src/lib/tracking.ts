// Conversion tracking events
// These fire to Google Analytics, GTM, and Facebook Pixel when configured

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
  // Only track if user accepted cookies
  if (localStorage.getItem("cookie-consent") !== "accepted") return;

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
}
