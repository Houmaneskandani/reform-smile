import "server-only";
import { SITE_CONFIG } from "@/lib/constants";
import { TIME_ZONE } from "@/lib/admin/format";
import { runQuery } from "./db";

// Read-only queries behind the admin dashboard (/admin). A "visit" is one random visit id: one
// browser tab, from the first page until the tab closes (see src/lib/analytics/client.ts). There
// is no way to recognise the same person on another day, so these are visits, not people.
// A visit "contacted us" if it sent a form or tapped a phone link.

export const RANGES = [7, 30, 90] as const;
export type RangeDays = (typeof RANGES)[number];

export function parseRange(value: string | string[] | undefined): RangeDays {
  const days = Number(Array.isArray(value) ? value[0] : value);
  return (RANGES as readonly number[]).includes(days) ? (days as RangeDays) : 30;
}

const SITE = new URL(SITE_CONFIG.url).host.replace(/^www\./, "");
const DAY_MS = 24 * 60 * 60 * 1000;

export type Window = { from: Date; to: Date };
export function windowFor(days: number, now = new Date()): { current: Window; previous: Window } {
  const to = now;
  const from = new Date(to.getTime() - days * DAY_MS);
  return { current: { from, to }, previous: { from: new Date(from.getTime() - days * DAY_MS), to: from } };
}

// Every query starts from the same filtered set of rows.
const EVENTS = `e AS (SELECT * FROM site_events WHERE site = $1 AND ts >= $2 AND ts < $3)`;
const params = (w: Window) => [SITE, w.from, w.to];
const CONTACTED = `(type = 'form_sent' OR (type = 'click' AND target = 'call'))`;
// Where a visit came from: its first campaign tag or referring site, else "direct".
const SOURCE = `coalesce((array_agg(coalesce(utm_source, referrer) ORDER BY ts)
  FILTER (WHERE coalesce(utm_source, referrer) IS NOT NULL))[1], 'direct')`;

const num = (value: unknown) => Number(value ?? 0);

export type Totals = {
  visits: number;
  pageviews: number;
  forms: number;
  calls: number;
  contactedVisits: number;
  totalSeconds: number;
};

export async function getTotals(w: Window): Promise<Totals> {
  const [row] = await runQuery(
    `WITH ${EVENTS}
     SELECT count(DISTINCT session_id) FILTER (WHERE type = 'pageview') AS visits,
            count(*) FILTER (WHERE type = 'pageview') AS pageviews,
            count(*) FILTER (WHERE type = 'form_sent') AS forms,
            count(*) FILTER (WHERE type = 'click' AND target = 'call') AS calls,
            count(DISTINCT session_id) FILTER (WHERE ${CONTACTED}) AS contacted_visits,
            coalesce(sum(value) FILTER (WHERE type = 'time'), 0) AS total_seconds
     FROM e`,
    params(w)
  );
  return {
    visits: num(row?.visits),
    pageviews: num(row?.pageviews),
    forms: num(row?.forms),
    calls: num(row?.calls),
    contactedVisits: num(row?.contacted_visits),
    totalSeconds: num(row?.total_seconds),
  };
}

export type DayPoint = { day: string; visits: number; pageviews: number };

/** One point per calendar day (Pacific time), including days without visits. */
export async function getDaily(w: Window): Promise<DayPoint[]> {
  const rows = await runQuery(
    `WITH ${EVENTS}
     SELECT to_char(date_trunc('day', ts AT TIME ZONE '${TIME_ZONE}'), 'YYYY-MM-DD') AS day,
            count(DISTINCT session_id) AS visits,
            count(*) AS pageviews
     FROM e WHERE type = 'pageview' GROUP BY 1`,
    params(w)
  );
  const byDay = new Map(rows.map((r) => [String(r.day), r]));
  // Every Pacific-time calendar day the window touches. Stepping 6 hours at a time (and once at
  // the very end) can't skip a day, even on the 23- and 25-hour days when clocks change.
  const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE });
  const days = new Set<string>();
  for (let t = w.from.getTime(); t < w.to.getTime(); t += DAY_MS / 4) days.add(dayKey.format(new Date(t)));
  days.add(dayKey.format(w.to));
  return [...days].map((day) => {
    const r = byDay.get(day);
    return { day, visits: num(r?.visits), pageviews: num(r?.pageviews) };
  });
}

export type FunnelStep = { label: string; visits: number };

export async function getFunnel(w: Window): Promise<FunnelStep[]> {
  const [row] = await runQuery(
    `WITH ${EVENTS},
     v AS (
       SELECT session_id,
              bool_or(type = 'pageview') AS visited,
              bool_or(type = 'pageview' AND path IN ('/services', '/about', '/gallery')) AS explored,
              bool_or(type = 'pageview' AND path IN ('/consultation', '/book', '/contact')) AS booking_page,
              bool_or(${CONTACTED}) AS contacted
       FROM e GROUP BY session_id)
     SELECT count(*) FILTER (WHERE visited) AS visited,
            count(*) FILTER (WHERE visited AND explored) AS explored,
            count(*) FILTER (WHERE visited AND booking_page) AS booking_page,
            count(*) FILTER (WHERE visited AND contacted) AS contacted
     FROM v`,
    params(w)
  );
  return [
    { label: "Visited the website", visits: num(row?.visited) },
    { label: "Looked at services, about or gallery", visits: num(row?.explored) },
    { label: "Opened a booking or contact page", visits: num(row?.booking_page) },
    { label: "Called or sent a request", visits: num(row?.contacted) },
  ];
}

export type PageRow = { path: string; views: number; avgSeconds: number; deepScrollRate: number };

export async function getTopPages(w: Window, limit = 10): Promise<PageRow[]> {
  const rows = await runQuery(
    `WITH ${EVENTS}
     SELECT path,
            count(*) FILTER (WHERE type = 'pageview') AS views,
            coalesce(sum(value) FILTER (WHERE type = 'time'), 0) AS seconds,
            count(*) FILTER (WHERE type = 'scroll' AND value >= 75) AS deep_scrolls
     FROM e GROUP BY path
     HAVING count(*) FILTER (WHERE type = 'pageview') > 0
     ORDER BY views DESC, path LIMIT ${limit}`,
    params(w)
  );
  return rows.map((r) => {
    const views = num(r.views);
    return {
      path: String(r.path),
      views,
      avgSeconds: views ? num(r.seconds) / views : 0,
      deepScrollRate: views ? Math.min(1, num(r.deep_scrolls) / views) : 0,
    };
  });
}

export type SourceRow = { source: string; visits: number; contacted: number };

export async function getSources(w: Window, limit = 8): Promise<SourceRow[]> {
  const rows = await runQuery(
    `WITH ${EVENTS},
     v AS (SELECT session_id, ${SOURCE} AS source, bool_or(${CONTACTED}) AS contacted
           FROM e GROUP BY session_id HAVING bool_or(type = 'pageview'))
     SELECT source, count(*) AS visits, count(*) FILTER (WHERE contacted) AS contacted
     FROM v GROUP BY source ORDER BY visits DESC, source LIMIT ${limit}`,
    params(w)
  );
  return rows.map((r) => ({ source: String(r.source), visits: num(r.visits), contacted: num(r.contacted) }));
}

export type CampaignRow = { source: string; medium: string | null; campaign: string; visits: number };

export async function getCampaigns(w: Window, limit = 6): Promise<CampaignRow[]> {
  const rows = await runQuery(
    `WITH ${EVENTS}
     SELECT utm_source, utm_medium, utm_campaign, count(DISTINCT session_id) AS visits
     FROM e WHERE type = 'pageview' AND utm_campaign IS NOT NULL
     GROUP BY 1, 2, 3 ORDER BY visits DESC LIMIT ${limit}`,
    params(w)
  );
  return rows.map((r) => ({
    source: String(r.utm_source ?? "—"),
    medium: r.utm_medium ? String(r.utm_medium) : null,
    campaign: String(r.utm_campaign),
    visits: num(r.visits),
  }));
}

export type ClickRow = { target: string; label: string | null; clicks: number; visits: number };

export async function getTopClicks(w: Window, limit = 10): Promise<ClickRow[]> {
  const rows = await runQuery(
    `WITH ${EVENTS}
     SELECT target, mode() WITHIN GROUP (ORDER BY label) AS label,
            count(*) AS clicks, count(DISTINCT session_id) AS visits
     FROM e WHERE type = 'click' AND target IS NOT NULL
     GROUP BY target ORDER BY clicks DESC, target LIMIT ${limit}`,
    params(w)
  );
  return rows.map((r) => ({
    target: String(r.target),
    label: r.label ? String(r.label) : null,
    clicks: num(r.clicks),
    visits: num(r.visits),
  }));
}

export type CountRow = { key: string; visits: number };

export async function getActions(w: Window): Promise<CountRow[]> {
  const rows = await runQuery(
    `WITH ${EVENTS}
     SELECT target AS key, count(DISTINCT session_id) AS visits
     FROM e WHERE type = 'action' GROUP BY target ORDER BY visits DESC`,
    params(w)
  );
  return rows.map((r) => ({ key: String(r.key), visits: num(r.visits) }));
}

export async function getDevices(w: Window): Promise<CountRow[]> {
  const rows = await runQuery(
    `WITH ${EVENTS},
     v AS (SELECT coalesce((array_agg(device ORDER BY ts) FILTER (WHERE device IS NOT NULL))[1], 'unknown') AS device
           FROM e WHERE type = 'pageview' GROUP BY session_id)
     SELECT device AS key, count(*) AS visits FROM v GROUP BY device ORDER BY visits DESC`,
    params(w)
  );
  return rows.map((r) => ({ key: String(r.key), visits: num(r.visits) }));
}

export type PlaceRow = { city: string; region: string | null; visits: number };

export async function getPlaces(w: Window, limit = 8): Promise<PlaceRow[]> {
  const rows = await runQuery(
    `WITH ${EVENTS},
     v AS (SELECT session_id,
                  (array_agg(city ORDER BY ts) FILTER (WHERE city IS NOT NULL))[1] AS city,
                  (array_agg(region ORDER BY ts) FILTER (WHERE region IS NOT NULL))[1] AS region
           FROM e WHERE type = 'pageview' GROUP BY session_id)
     SELECT coalesce(city, 'Unknown') AS city, region, count(*) AS visits
     FROM v GROUP BY 1, 2 ORDER BY visits DESC, city LIMIT ${limit}`,
    params(w)
  );
  return rows.map((r) => ({ city: String(r.city), region: r.region ? String(r.region) : null, visits: num(r.visits) }));
}

export type JourneyStep = {
  ts: string;
  type: string;
  path: string;
  target: string | null;
  label: string | null;
  value: number | null;
};

export type Journey = {
  id: string;
  started: Date;
  ended: Date;
  source: string;
  campaign: string | null;
  device: string | null;
  city: string | null;
  region: string | null;
  pages: number;
  seconds: number;
  sentForm: boolean;
  called: boolean;
  steps: JourneyStep[];
};

/** The most recent visits, newest first, each with its steps in order. */
export async function getJourneys(
  w: Window,
  { limit = 40, contactedOnly = false }: { limit?: number; contactedOnly?: boolean } = {}
): Promise<Journey[]> {
  const rows = await runQuery(
    `WITH ${EVENTS}
     SELECT session_id,
            min(ts) AS started, max(ts) AS ended,
            ${SOURCE} AS source,
            (array_agg(utm_campaign ORDER BY ts) FILTER (WHERE utm_campaign IS NOT NULL))[1] AS campaign,
            (array_agg(device ORDER BY ts) FILTER (WHERE device IS NOT NULL))[1] AS device,
            (array_agg(city ORDER BY ts) FILTER (WHERE city IS NOT NULL))[1] AS city,
            (array_agg(region ORDER BY ts) FILTER (WHERE region IS NOT NULL))[1] AS region,
            count(*) FILTER (WHERE type = 'pageview') AS pages,
            coalesce(sum(value) FILTER (WHERE type = 'time'), 0) AS seconds,
            bool_or(type = 'form_sent') AS sent_form,
            bool_or(type = 'click' AND target = 'call') AS called,
            json_agg(json_build_object('ts', ts, 'type', type, 'path', path, 'target', target,
                                       'label', label, 'value', value) ORDER BY ts, id)
              FILTER (WHERE type IN ('pageview', 'click', 'form_sent', 'action')) AS steps
     FROM e GROUP BY session_id
     HAVING bool_or(type = 'pageview') ${contactedOnly ? `AND bool_or(${CONTACTED})` : ""}
     ORDER BY started DESC LIMIT ${limit}`,
    params(w)
  );
  return rows.map((r) => ({
    id: String(r.session_id),
    started: new Date(String(r.started)),
    ended: new Date(String(r.ended)),
    source: String(r.source),
    campaign: r.campaign ? String(r.campaign) : null,
    device: r.device ? String(r.device) : null,
    city: r.city ? String(r.city) : null,
    region: r.region ? String(r.region) : null,
    pages: num(r.pages),
    seconds: num(r.seconds),
    sentForm: Boolean(r.sent_form),
    called: Boolean(r.called),
    steps: (r.steps as JourneyStep[] | null) ?? [],
  }));
}
