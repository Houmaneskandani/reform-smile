// Display helpers for the admin dashboard: numbers, durations, and plain-English names for pages,
// sources and clicks. No server-only code here, so client components can use it too.

export const TIME_ZONE = "America/Los_Angeles";

export const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");

export function fmtPct(fraction: number): string {
  if (!Number.isFinite(fraction) || fraction <= 0) return "0%";
  const pct = fraction * 100;
  return pct < 10 ? `${pct.toFixed(1).replace(/\.0$/, "")}%` : `${Math.round(pct)}%`;
}

export function fmtDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
  return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}m`;
}

export type Delta = { text: string; tone: "up" | "down" | "flat" };

/** Change against the previous period of the same length. */
export function delta(current: number, previous: number): Delta {
  if (previous === 0) return current === 0 ? { text: "—", tone: "flat" } : { text: "new", tone: "up" };
  const change = (current - previous) / previous;
  if (Math.abs(change) < 0.005) return { text: "0%", tone: "flat" };
  return { text: `${change > 0 ? "+" : "−"}${fmtPct(Math.abs(change))}`, tone: change > 0 ? "up" : "down" };
}

const shortDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
/** "2026-11-13" → "Nov 13" */
export function fmtDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return shortDay.format(new Date(Date.UTC(y, m - 1, d)));
}

const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});
export const fmtDateTime = (date: Date) => dateTime.format(date);

/** "+1:05" — time since the start of a visit. */
export function fmtOffset(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return `+${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/services": "Services",
  "/gallery": "Gallery",
  "/blog": "Blog",
  "/contact": "Contact",
  "/book": "Book an appointment",
  "/consultation": "Free consultation",
  "/privacy": "Privacy policy",
  "/review": "Rate your visit",
};
export const pageName = (path: string) => PAGE_NAMES[path] ?? path;

const SOURCE_NAMES: Record<string, string> = {
  direct: "Direct / unknown",
  google: "Google",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
  yahoo: "Yahoo",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X (Twitter)",
  tiktok: "TikTok",
  yelp: "Yelp",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};
export const sourceName = (source: string) => SOURCE_NAMES[source] ?? source;

const ACTION_NAMES: Record<string, string> = {
  quiz_started: "Started the treatment quiz",
  quiz_completed: "Finished the treatment quiz",
  cost_estimator_started: "Started the cost estimator",
  cost_estimator_completed: "Finished the cost estimator",
  chat_opened: "Opened the chat",
  chat_message_sent: "Sent a chat message",
};
export const actionName = (key: string) => ACTION_NAMES[key] ?? key.replace(/_/g, " ");

const DEVICE_NAMES: Record<string, string> = {
  mobile: "Phone",
  tablet: "Tablet",
  desktop: "Computer",
  unknown: "Unknown",
};
export const deviceName = (device: string | null) => DEVICE_NAMES[device ?? "unknown"] ?? device ?? "Unknown";

/** What a click target means, e.g. "call" → "Tapped the phone number". */
export function clickTargetName(target: string): string {
  if (target === "call") return "Phone number";
  if (target === "email") return "Email address";
  if (target === "button") return "Button";
  if (target.startsWith("link:")) return `Link to ${pageName(target.slice(5).split("#")[0] || "/")}`;
  if (target.startsWith("out:")) return `Leaves to ${target.slice(4)}`;
  return target;
}

/** One step of a visit, in plain words. */
export function stepText(step: { type: string; path: string; target: string | null; label: string | null }): string {
  switch (step.type) {
    case "pageview":
      return `Viewed ${pageName(step.path)}`;
    case "click":
      if (step.target === "call") return "Tapped the phone number to call";
      if (step.target === "email") return "Tapped the email address";
      return step.label ? `Clicked “${step.label}”` : `Clicked ${clickTargetName(step.target ?? "button")}`;
    case "form_sent":
      return `Sent the ${step.target ?? "contact"} form`;
    case "action":
      return actionName(step.target ?? "");
    default:
      return step.type;
  }
}
