// Browser side of the site's own visit statistics: sends one small event to /api/track.
// Used by src/components/VisitorTracker.tsx (page views, clicks, scroll, time on page) and by
// trackEvent() in src/lib/tracking.ts (forms sent, quiz, cost estimator, chat).
//
// Privacy: no cookies. A random visit number lives in sessionStorage, so it is forgotten when
// the tab closes and can't connect one visit to the next. Only the page address is sent, never
// its ?query (it can contain emails or names from links), and never anything typed into a form.
// Nothing is sent from browsers that send Global Privacy Control or Do Not Track, from automated
// browsers, or outside a production build.

export type SiteEventType = "pageview" | "click" | "scroll" | "time" | "form_sent" | "action";

export type SiteEventInput = {
  type: SiteEventType;
  path?: string;
  target?: string;
  label?: string;
  value?: number;
};

const ENDPOINT = "/api/track";
const SESSION_KEY = "rd-visit";

let memorySessionId: string | null = null;
// The referring site is only meaningful for the first page view after a page load:
// document.referrer keeps its value while the visitor moves around the site without reloading.
let referrerSent = false;

function randomId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function sessionId(): string {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = randomId();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Storage blocked (strict privacy settings): one number for as long as the page is open.
    memorySessionId ??= randomId();
    return memorySessionId;
  }
}

let allowedCache: boolean | null = null;
function trackingAllowed(): boolean {
  if (allowedCache !== null) return allowedCache;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  allowedCache =
    process.env.NODE_ENV === "production" &&
    !nav.webdriver &&
    nav.globalPrivacyControl !== true &&
    nav.doNotTrack !== "1";
  return allowedCache;
}

function deviceClass(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/**
 * Where the visit came from: the utm_* campaign tags whenever the address has them (a campaign
 * link can be opened at any point of a visit), and the other site's host on the first page view
 * after a page load.
 */
function landingDetails(): Record<string, string> {
  const details: Record<string, string> = {};
  try {
    if (!referrerSent && document.referrer) {
      referrerSent = true;
      const host = new URL(document.referrer).host;
      if (host && host !== window.location.host) details.r = host;
    }
  } catch {
    // An unreadable referrer is simply left out.
  }
  const params = new URLSearchParams(window.location.search);
  for (const [param, key] of [
    ["utm_source", "us"],
    ["utm_medium", "um"],
    ["utm_campaign", "uc"],
  ] as const) {
    const value = params.get(param)?.trim();
    if (value) details[key] = value.slice(0, 100);
  }
  return details;
}

/** Sends one event. Never throws: statistics must not affect the page. */
export function sendSiteEvent(event: SiteEventInput): void {
  if (typeof window === "undefined") return;
  try {
    if (!trackingAllowed()) return;

    const payload: Record<string, string | number> = {
      t: event.type,
      p: (event.path ?? window.location.pathname).slice(0, 300),
      s: sessionId(),
      d: deviceClass(),
    };
    if (event.target) payload.tg = event.target.slice(0, 120);
    if (event.label) payload.l = event.label.slice(0, 80);
    if (event.value !== undefined) payload.v = Math.max(0, Math.min(100_000, Math.round(event.value)));
    if (event.type === "pageview") Object.assign(payload, landingDetails());

    const body = JSON.stringify(payload);
    // sendBeacon survives the page closing (time on page is sent as the visitor leaves).
    const sent =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
    if (!sent) {
      void fetch(ENDPOINT, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Ignore: a failed statistic is never worth an error on the page.
  }
}
