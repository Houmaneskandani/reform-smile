import { z } from "zod";
import { SITE_CONFIG } from "@/lib/constants";
import { analyticsConfigured, EVENT_TYPES, insertEvent, type SiteEvent } from "@/lib/analytics/db";
import { createRateLimiter, getClientIp, hostOf, isSameOrigin } from "@/lib/server/request-guards";

// Receives the site's own anonymous visit statistics from src/components/VisitorTracker.tsx
// (page views, clicks, scroll depth, time on page, forms sent) and stores them with
// src/lib/analytics/db.ts. See CLAUDE.md → "Visitor statistics".
//
// It always answers 204 with no body, also when it ignores an event, so the browser has nothing
// to retry and a visitor never sees an error. Events are ignored when the database isn't set up,
// when the request isn't for the real site (previews, ava-green.vercel.app, other sites), for
// bots, and over the rate limit.

export const runtime = "nodejs";

const MAX_BODY_CHARS = 2_000;
// A real visitor sends a few events per page; this only stops floods.
const isRateLimited = createRateLimiter({ max: 300, windowMs: 10 * 60 * 1000 });

const BOT_USER_AGENT =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|embedly|vercel|curl|wget|python|httpclient|axios|node-fetch/i;

const text = (max: number) => z.string().trim().min(1).max(max);

// The browser sends short keys to keep each event small (see src/lib/analytics/client.ts).
const payloadSchema = z.object({
  t: z.enum(EVENT_TYPES),
  p: z.string().startsWith("/").max(300),
  s: z.string().regex(/^[a-f0-9]{16,32}$/),
  tg: text(120).optional(),
  l: text(80).optional(),
  v: z.number().int().min(0).max(100_000).optional(),
  r: text(255).optional(),
  us: text(100).optional(),
  um: text(100).optional(),
  uc: text(100).optional(),
  d: z.enum(["mobile", "tablet", "desktop"]).optional(),
});

/** Hosts whose visits are counted: the public site, plus ANALYTICS_TEST_HOSTS for local tests. */
function countedHosts(): string[] {
  const extra = (process.env.ANALYTICS_TEST_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  return [hostOf(SITE_CONFIG.url), ...extra].filter((host): host is string => Boolean(host));
}

/** Only the page address: no ?query (it can carry emails or names from links) and no #hash. */
function cleanPath(path: string): string {
  const bare = path.split(/[?#]/)[0] || "/";
  return bare.length > 1 ? bare.replace(/\/+$/, "") : bare;
}

/** Where the visit came from, in plain words: "google", "instagram", … or the other site's host. */
function referrerSource(host: string | undefined, siteHost: string): string | null {
  if (!host) return null;
  const h = host.toLowerCase().replace(/^www\./, "").replace(/:\d+$/, "");
  if (h === siteHost.replace(/^www\./, "")) return null; // moving around our own site
  if (/(^|\.)google\./.test(h)) return "google";
  if (/(^|\.)bing\.com$/.test(h)) return "bing";
  if (/(^|\.)duckduckgo\.com$/.test(h)) return "duckduckgo";
  if (/(^|\.)yahoo\./.test(h)) return "yahoo";
  if (/(^|\.)instagram\.com$/.test(h)) return "instagram";
  if (/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(h)) return "facebook";
  if (/(^|\.)(t\.co|twitter\.com|x\.com)$/.test(h)) return "x";
  if (/(^|\.)tiktok\.com$/.test(h)) return "tiktok";
  if (/(^|\.)yelp\.com$/.test(h)) return "yelp";
  if (/(^|\.)youtube\.com$/.test(h)) return "youtube";
  if (/(^|\.)linkedin\.com$/.test(h)) return "linkedin";
  return h.slice(0, 100);
}

/** Vercel's location headers (from the IP address, which is not stored). City is URL-encoded. */
function geo(request: Request, name: string): string | null {
  const raw = request.headers.get(name);
  if (!raw) return null;
  try {
    return decodeURIComponent(raw).slice(0, 80);
  } catch {
    return raw.slice(0, 80);
  }
}

const lower = (value: string | undefined) => (value ? value.toLowerCase() : null);

const noContent = () => new Response(null, { status: 204 });

export async function POST(request: Request) {
  if (!analyticsConfigured()) return noContent();

  const host = request.headers.get("host")?.toLowerCase() ?? "";
  if (!countedHosts().includes(host)) return noContent();
  if (!isSameOrigin(request)) return noContent();
  if (BOT_USER_AGENT.test(request.headers.get("user-agent") ?? "")) return noContent();
  if (isRateLimited(getClientIp(request))) return noContent();

  let payload: z.infer<typeof payloadSchema>;
  try {
    const body = await request.text();
    if (body.length > MAX_BODY_CHARS) return noContent();
    const parsed = payloadSchema.safeParse(JSON.parse(body));
    if (!parsed.success) return noContent();
    payload = parsed.data;
  } catch {
    return noContent();
  }

  const event: SiteEvent = {
    site: host.replace(/^www\./, ""),
    sessionId: payload.s,
    type: payload.t,
    path: cleanPath(payload.p),
    target: payload.tg ?? null,
    label: payload.l ?? null,
    value: payload.v ?? null,
    referrer: referrerSource(payload.r, host),
    utmSource: lower(payload.us),
    utmMedium: lower(payload.um),
    utmCampaign: lower(payload.uc),
    device: payload.d ?? null,
    country: geo(request, "x-vercel-ip-country"),
    region: geo(request, "x-vercel-ip-country-region"),
    city: geo(request, "x-vercel-ip-city"),
  };

  try {
    await insertEvent(event);
  } catch (error) {
    // Statistics must never affect visitors; the error goes to the server log only.
    console.error("[analytics] Could not store event:", error instanceof Error ? error.message : error);
  }
  return noContent();
}
