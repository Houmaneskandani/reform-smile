import "server-only";
import { Pool } from "pg";

// Storage for the site's own visit statistics (see /api/track and CLAUDE.md → "Visitor statistics").
// One table, site_events, in the website's own Neon Postgres database (DATABASE_URL, set by
// Vercel's Neon integration). It holds no personal data: no IP address, no user agent, no names,
// no form contents. While DATABASE_URL is unset, nothing is stored and /api/track does nothing.

export const EVENT_TYPES = ["pageview", "click", "scroll", "time", "form_sent", "action"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export type SiteEvent = {
  site: string;
  sessionId: string;
  type: EventType;
  path: string;
  target: string | null;
  label: string | null;
  value: number | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  device: "mobile" | "tablet" | "desktop" | null;
  country: string | null;
  region: string | null;
  city: string | null;
};

/** Rows older than this are deleted (about 13 months, so a year can be compared with the last). */
const RETENTION_DAYS = 400;
/** Share of inserts that also run the clean-up, so it happens a few times a day at most. */
const CLEANUP_CHANCE = 0.002;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS site_events (
  id           bigserial PRIMARY KEY,
  ts           timestamptz NOT NULL DEFAULT now(),
  site         text NOT NULL,
  session_id   text NOT NULL,
  type         text NOT NULL CHECK (type IN (${EVENT_TYPES.map((t) => `'${t}'`).join(", ")})),
  path         text NOT NULL,
  target       text,
  label        text,
  value        integer,
  referrer     text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  device       text,
  country      text,
  region       text,
  city         text
);
CREATE INDEX IF NOT EXISTS site_events_site_ts_idx ON site_events (site, ts);
CREATE INDEX IF NOT EXISTS site_events_session_idx ON site_events (session_id, ts);
`;

export function analyticsConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let pool: Pool | null = null;
function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Serverless: few connections per instance, closed soon after they go idle.
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });
    // An idle connection dropped by the database must not crash the server.
    pool.on("error", (error) => console.error("[analytics] Database connection error:", error.message));
  }
  return pool;
}

// The table is created on first use (once per server instance), so there is no separate
// setup step after the database is added in Vercel.
let schemaReady: Promise<void> | null = null;
function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(SCHEMA_SQL)
      .then(() => undefined)
      .catch((error) => {
        schemaReady = null; // try again on the next request
        throw error;
      });
  }
  return schemaReady;
}

export async function insertEvent(event: SiteEvent): Promise<void> {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO site_events
       (site, session_id, type, path, target, label, value, referrer,
        utm_source, utm_medium, utm_campaign, device, country, region, city)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      event.site,
      event.sessionId,
      event.type,
      event.path,
      event.target,
      event.label,
      event.value,
      event.referrer,
      event.utmSource,
      event.utmMedium,
      event.utmCampaign,
      event.device,
      event.country,
      event.region,
      event.city,
    ]
  );

  if (Math.random() < CLEANUP_CHANCE) {
    await getPool().query(`DELETE FROM site_events WHERE ts < now() - make_interval(days => $1)`, [
      RETENTION_DAYS,
    ]);
  }
}
