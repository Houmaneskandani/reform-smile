// Turns structured content values into the strings the site shows. Pure functions with no
// imports at runtime, so they are safe in client components.

import type { DayHours, Offer } from "./schema";

/** "09:00" -> "9:00 AM", "17:30" -> "5:30 PM", "12:00" -> "12:00 PM". */
export function formatTime(value: string): string {
  const [hours, minutes] = value.split(":");
  const h = Number(hours);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${minutes} ${period}`;
}

/**
 * { closed: false, opens: "09:00", closes: "17:00" } -> "9:00 AM - 5:00 PM"; a closed day
 * -> "Closed". StructuredData parses exactly this format back into opening hours for Google.
 */
export function formatHours(day: DayHours): string {
  return day.closed ? "Closed" : `${formatTime(day.opens)} - ${formatTime(day.closes)}`;
}

/** 9000 -> "$9,000" */
export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

/**
 * A price range from optional ends: "$1,500–$3,000", "from $1,500", "up to $3,000", or
 * null when neither is set.
 */
export function formatPriceRange(
  min: number | null | undefined,
  max: number | null | undefined
): string | null {
  if (min != null && max != null) {
    return min === max ? formatMoney(min) : `${formatMoney(min)}–${formatMoney(max)}`;
  }
  if (min != null) return `from ${formatMoney(min)}`;
  if (max != null) return `up to ${formatMoney(max)}`;
  return null;
}

/** An empty social link becomes "#", which the footer and structured data skip. */
export function socialHref(url: string | null | undefined): string {
  return url || "#";
}

/** "(555) 123-4567" -> "tel:5551234567" */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9]/g, "")}`;
}

// Offer end dates are calendar days at the practice.
const PRACTICE_TIME_ZONE = "America/Los_Angeles";

/** Today's date at the practice as "YYYY-MM-DD". */
function practiceDate(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PRACTICE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** True while the offer is switched on and its last day (if any) hasn't passed. */
export function isOfferLive(offer: Offer, now: Date): boolean {
  if (!offer.enabled) return false;
  if (!offer.endsOn) return true;
  return practiceDate(now) <= offer.endsOn;
}
