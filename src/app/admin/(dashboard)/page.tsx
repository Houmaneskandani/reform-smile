import type { Metadata } from "next";
import Link from "next/link";
import { analyticsConfigured } from "@/lib/analytics/db";
import {
  getActions,
  getCampaigns,
  getDaily,
  getDevices,
  getFunnel,
  getJourneys,
  getPlaces,
  getSources,
  getTopClicks,
  getTopPages,
  getTotals,
  parseRange,
  windowFor,
} from "@/lib/analytics/queries";
import {
  actionName,
  clickTargetName,
  delta,
  deviceName,
  fmtDuration,
  fmtInt,
  fmtPct,
  pageName,
  sourceName,
} from "@/lib/admin/format";
import { BarList, Card, DailyChart, Funnel, JourneyCard, KpiCard, Notice, RangeTabs } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function OverviewPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const days = parseRange((await searchParams).range);

  if (!analyticsConfigured()) {
    return (
      <Header days={days}>
        <Notice title="The statistics database isn't connected">
          <p>Visits are recorded once a Neon database is connected to the Vercel project (it sets DATABASE_URL).</p>
        </Notice>
      </Header>
    );
  }

  const { current, previous } = windowFor(days);
  let data;
  try {
    const [totals, before, daily, funnel, pages, sources, campaigns, clicks, actions, devices, places, recent] =
      await Promise.all([
        getTotals(current),
        getTotals(previous),
        getDaily(current),
        getFunnel(current),
        getTopPages(current),
        getSources(current),
        getCampaigns(current),
        getTopClicks(current),
        getActions(current),
        getDevices(current),
        getPlaces(current),
        getJourneys(current, { limit: 5 }),
      ]);
    data = { totals, before, daily, funnel, pages, sources, campaigns, clicks, actions, devices, places, recent };
  } catch (error) {
    console.error("[admin] Could not load statistics:", error instanceof Error ? error.message : error);
    return (
      <Header days={days}>
        <Notice title="The statistics couldn't be loaded">
          <p>The database didn&apos;t answer. Try again in a minute; if it keeps happening, check the Neon database in Vercel → Storage.</p>
        </Notice>
      </Header>
    );
  }

  const { totals, before, daily, funnel, pages, sources, campaigns, clicks, actions, devices, places, recent } = data;
  const conversion = totals.visits ? totals.contactedVisits / totals.visits : 0;
  const conversionBefore = before.visits ? before.contactedVisits / before.visits : 0;
  const totalDeviceVisits = devices.reduce((sum, d) => sum + d.visits, 0);

  return (
    <Header days={days}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 2xl:grid-cols-6">
        <KpiCard label="Visits" value={fmtInt(totals.visits)} change={delta(totals.visits, before.visits)} note={`${days} days`} />
        <KpiCard
          label="Page views"
          value={fmtInt(totals.pageviews)}
          change={delta(totals.pageviews, before.pageviews)}
          note={totals.visits ? `${(totals.pageviews / totals.visits).toFixed(1)} per visit` : undefined}
        />
        <KpiCard
          label="Time per visit"
          value={fmtDuration(totals.visits ? totals.totalSeconds / totals.visits : 0)}
          change={delta(totals.visits ? totals.totalSeconds / totals.visits : 0, before.visits ? before.totalSeconds / before.visits : 0)}
          note="average, while the page was on screen"
        />
        <KpiCard label="Requests sent" value={fmtInt(totals.forms)} change={delta(totals.forms, before.forms)} note="contact, booking & consultation forms" />
        <KpiCard label="Calls tapped" value={fmtInt(totals.calls)} change={delta(totals.calls, before.calls)} note="taps on the phone number" />
        <KpiCard
          label="Contacted us"
          value={fmtPct(conversion)}
          change={delta(conversion, conversionBefore)}
          note={`${fmtInt(totals.contactedVisits)} of ${fmtInt(totals.visits)} visits called or sent a request`}
          highlight
        />
      </div>

      {totals.visits === 0 ? (
        <div className="mt-6">
          <Notice title="No visits recorded in this period yet">
            <p>Statistics appear here as soon as people visit the website. Try a longer date range above.</p>
          </Notice>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <Card title="Visits per day" subtitle="Hover a bar for that day's page views" className="xl:col-span-2">
              <DailyChart points={daily} />
            </Card>
            <Card title="From visit to patient" subtitle="Visits that reached each step">
              <Funnel steps={funnel} />
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card title="Most viewed pages" subtitle="Views · average time on the page · how many read to 75%">
              <BarList
                rows={pages.map((p) => ({
                  key: p.path,
                  label: pageName(p.path),
                  sub: p.path,
                  value: p.views,
                  extra: `${fmtDuration(p.avgSeconds)} · ${fmtPct(p.deepScrollRate)} read`,
                }))}
              />
            </Card>
            <Card title="Where visits come from" subtitle="First source of each visit · how many contacted us">
              <BarList
                rows={sources.map((s) => ({
                  key: s.source,
                  label: sourceName(s.source),
                  value: s.visits,
                  extra: s.contacted ? `${fmtInt(s.contacted)} contacted` : undefined,
                }))}
              />
              {campaigns.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray mb-2">Campaign links (utm tags)</h3>
                  <BarList
                    rows={campaigns.map((c) => ({
                      key: `${c.source}/${c.medium}/${c.campaign}`,
                      label: c.campaign,
                      sub: [c.source, c.medium].filter(Boolean).join(" · "),
                      value: c.visits,
                    }))}
                  />
                </div>
              )}
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card title="Most clicked" subtitle="Buttons and links, with their text">
              <BarList
                rows={clicks.map((c) => ({
                  key: c.target,
                  label: c.label ?? clickTargetName(c.target),
                  sub: clickTargetName(c.target),
                  value: c.clicks,
                }))}
              />
            </Card>
            <Card title="Tools used" subtitle="Visits that used each feature">
              <BarList
                rows={actions.map((a) => ({ key: a.key, label: actionName(a.key), value: a.visits }))}
                empty="No one has used the quiz, cost estimator or chat in this period."
              />
            </Card>
            <Card title="Devices and places" subtitle="Share of visits">
              <BarList
                rows={devices.map((d) => ({
                  key: d.key,
                  label: deviceName(d.key),
                  value: d.visits,
                  display: fmtPct(totalDeviceVisits ? d.visits / totalDeviceVisits : 0),
                }))}
              />
              <h3 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-gray">Top cities</h3>
              <BarList
                rows={places.map((p) => ({
                  key: `${p.city}/${p.region}`,
                  label: p.region ? `${p.city}, ${p.region}` : p.city,
                  value: p.visits,
                }))}
              />
            </Card>
          </div>

          <div className="mt-6">
            <Card
              title="Latest visits"
              subtitle="Open one to see every step"
              action={
                <Link href={`/admin/journeys?range=${days}`} className="text-sm font-semibold text-navy hover:text-gold-ink whitespace-nowrap">
                  All journeys →
                </Link>
              }
            >
              <div className="space-y-2">
                {recent.map((journey) => (
                  <JourneyCard key={journey.id} journey={journey} />
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </Header>
  );
}

function Header({ days, children }: { days: number; children: React.ReactNode }) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-gold-ink text-xs font-semibold uppercase tracking-widest">Website statistics</p>
          <h1 className="font-heading text-3xl md:text-4xl text-navy mt-1">Overview</h1>
        </div>
        <RangeTabs basePath="/admin" current={days} />
      </div>
      {children}
    </>
  );
}
