import type { LeadSource } from "./leads";

// Where a visit came from, for labelling a form lead in Marketing Ava ("Google Ads", "Facebook",
// "Website"…). Remembered in sessionStorage on the first page of a visit (first touch) and read
// only when a form is sent while the lead forward is on. Nothing here is sent anywhere by itself.
//
// Kept to the minimum CLAUDE.md allows with a lead: the utm_source / utm_medium / utm_campaign
// tags and the referring site's address without its path or query. Nothing is remembered from
// browsers that send Global Privacy Control or Do Not Track.

const KEY = "rd-first-touch";
const MAX_LENGTH = 100;

type FirstTouch = Omit<LeadSource, "page">;

function privacySignal(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1";
}

/** Call on every page view: it keeps the first page's details and ignores later ones. */
export function rememberFirstTouch(): void {
  if (typeof window === "undefined") return;
  try {
    if (privacySignal() || window.sessionStorage.getItem(KEY) !== null) return;

    const touch: FirstTouch = {};
    const params = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
      const value = params.get(key)?.trim();
      if (value) touch[key] = value.slice(0, MAX_LENGTH);
    }
    if (document.referrer) {
      const referrer = new URL(document.referrer);
      if (/^https?:$/.test(referrer.protocol) && referrer.host !== window.location.host) {
        touch.referrer = referrer.origin; // "https://www.google.com": no path, no query
      }
    }
    window.sessionStorage.setItem(KEY, JSON.stringify(touch));
  } catch {
    // Storage blocked or an unreadable referrer: the lead is simply labelled "Website".
  }
}

/** The visit's first-touch details plus the page the form is on. */
export function getLeadSource(): LeadSource {
  const source: LeadSource = { page: window.location.pathname.slice(0, 300) };
  try {
    if (privacySignal()) return source;
    const stored = JSON.parse(window.sessionStorage.getItem(KEY) ?? "{}") as Record<string, unknown>;
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "referrer"] as const) {
      const value = stored[key];
      if (typeof value === "string" && value) source[key] = value.slice(0, 300);
    }
  } catch {
    // Unreadable storage: send the page only.
  }
  return source;
}
