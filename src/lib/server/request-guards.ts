import "server-only";
import { SITE_CONFIG } from "@/lib/constants";

// Request checks shared by the site's own API routes (/api/chat, /api/track).

/** The host part of a URL ("example.com:3000"), or null if it isn't a URL. */
export function hostOf(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

/**
 * True unless the request clearly comes from another website.
 * Browsers always send Origin (and Sec-Fetch-Site) on POST, so a foreign page is rejected.
 * Clients outside a browser send no Origin and can set any header; rate limits cover those.
 */
export function isSameOrigin(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const originHost = hostOf(origin); // null for "Origin: null" (sandboxed frames, file://)
  if (!originHost) return false;
  // The public site address, plus the host this request was sent to (custom domain,
  // preview deployments, localhost). A browser can't forge either for another site.
  const allowedHosts = [
    hostOf(SITE_CONFIG.url),
    request.headers.get("host"),
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),
  ];
  return allowedHosts.includes(originHost);
}

/** The visitor's IP address, for rate limiting only (never stored). */
export function getClientIp(request: Request): string {
  // On Vercel, x-forwarded-for is set by the platform; its first entry is the client.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * A simple fixed-window rate limit, keyed by IP. Best-effort only: the counts live in the
 * memory of one server instance, and the platform runs several and recycles them. For a strict
 * limit, move this to a shared store (e.g. Upstash Redis) or the host's firewall.
 * Returns a function that answers "is this key over its limit?" and counts the request.
 */
export function createRateLimiter({
  max,
  windowMs,
  maxTracked = 10_000,
}: {
  max: number;
  windowMs: number;
  maxTracked?: number;
}) {
  const windows = new Map<string, { count: number; windowStart: number }>();

  return function isRateLimited(key: string, now: number = Date.now()): boolean {
    const entry = windows.get(key);
    if (entry && now - entry.windowStart < windowMs) {
      entry.count += 1;
      return entry.count > max;
    }

    if (windows.size >= maxTracked) {
      // Keep memory bounded: drop expired windows, and start over if that isn't enough.
      for (const [k, value] of windows) {
        if (now - value.windowStart >= windowMs) windows.delete(k);
      }
      if (windows.size >= maxTracked) windows.clear();
    }
    windows.set(key, { count: 1, windowStart: now });
    return false;
  };
}
