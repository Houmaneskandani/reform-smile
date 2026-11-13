import type { Metadata } from "next";
import Link from "next/link";
import { analyticsConfigured } from "@/lib/analytics/db";
import { getJourneys, parseRange, windowFor, type Journey } from "@/lib/analytics/queries";
import { JourneyCard, Notice, RangeTabs } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Visitor journeys" };
export const dynamic = "force-dynamic";

const LIMIT = 60;

export default async function JourneysPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const days = parseRange(params.range);
  const contactedOnly = params.show === "contacted";

  // Load first, render after: errors are caught here, never while rendering.
  let journeys: Journey[] | null = null;
  let failed = false;
  if (analyticsConfigured()) {
    try {
      journeys = await getJourneys(windowFor(days).current, { limit: LIMIT, contactedOnly });
    } catch (error) {
      console.error("[admin] Could not load journeys:", error instanceof Error ? error.message : error);
      failed = true;
    }
  }

  let content: React.ReactNode;
  if (!analyticsConfigured()) {
    content = (
      <Notice title="The statistics database isn't connected">
        <p>Visits are recorded once a Neon database is connected to the Vercel project (it sets DATABASE_URL).</p>
      </Notice>
    );
  } else if (failed || !journeys) {
    content = (
      <Notice title="The visits couldn't be loaded">
        <p>The database didn&apos;t answer. Try again in a minute.</p>
      </Notice>
    );
  } else if (journeys.length === 0) {
    content = (
      <Notice title={contactedOnly ? "No visit contacted us in this period" : "No visits recorded in this period yet"}>
        <p>Try a longer date range{contactedOnly ? " or show all visits" : ""}.</p>
      </Notice>
    );
  } else {
    content = (
      <>
        <div className="space-y-2">
          {journeys.map((journey, i) => (
            <JourneyCard key={journey.id} journey={journey} open={i === 0} />
          ))}
        </div>
        {journeys.length === LIMIT && (
          <p className="mt-4 text-xs text-gray">Showing the {LIMIT} most recent visits in this period.</p>
        )}
      </>
    );
  }

  const filterLink = (show: string | null, label: string) => {
    const active = (show === "contacted") === contactedOnly;
    const query = new URLSearchParams({ range: String(days), ...(show ? { show } : {}) }).toString();
    return (
      <Link
        href={`/admin/journeys?${query}`}
        aria-current={active ? "page" : undefined}
        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${active ? "bg-navy text-white" : "text-navy hover:bg-cream"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-gold-ink text-xs font-semibold uppercase tracking-widest">Website statistics</p>
          <h1 className="font-heading text-3xl md:text-4xl text-navy mt-1">Visitor journeys</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray">
            Each visit, step by step: where it came from, the pages it opened and what it clicked.
            Visits are anonymous, so the same person on another day shows up as a new visit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <nav aria-label="Which visits" className="inline-flex rounded-full bg-white p-1 border border-cream-dark/70 shadow-sm">
            {filterLink(null, "All visits")}
            {filterLink("contacted", "Contacted us")}
          </nav>
          <RangeTabs basePath="/admin/journeys" current={days} extra={contactedOnly ? { show: "contacted" } : {}} />
        </div>
      </div>
      {content}
    </>
  );
}
