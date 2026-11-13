import Link from "next/link";
import type { ReactNode } from "react";
import type { DayPoint, FunnelStep, Journey } from "@/lib/analytics/queries";
import {
  deviceName,
  fmtDateTime,
  fmtDay,
  fmtDuration,
  fmtInt,
  fmtOffset,
  fmtPct,
  sourceName,
  stepText,
  type Delta,
} from "@/lib/admin/format";

// Building blocks of the admin dashboard, in the website's navy / gold / cream.
// Plain server components: no client JavaScript, so the dashboard stays fast.

export function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white rounded-2xl border border-cream-dark/70 shadow-sm ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-5 md:px-6 md:pt-6">
          <div>
            {title && <h2 className="font-heading text-lg text-navy leading-tight">{title}</h2>}
            {subtitle && <p className="text-gray text-xs mt-1">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

const TONE = {
  up: "bg-emerald-50 text-emerald-700",
  down: "bg-rose-50 text-rose-700",
  flat: "bg-gray-lighter text-gray",
};

export function KpiCard({
  label,
  value,
  note,
  change,
  highlight = false,
}: {
  label: string;
  value: string;
  note?: string;
  change?: Delta;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        highlight ? "bg-navy border-navy text-white" : "bg-white border-cream-dark/70"
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wider ${highlight ? "text-white/75" : "text-gray"}`}>
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className={`font-heading text-3xl leading-none whitespace-nowrap ${highlight ? "text-white" : "text-navy"}`}>{value}</p>
        {change && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
              highlight ? "bg-white/15 text-white" : TONE[change.tone]
            }`}
            title="Compared with the previous period of the same length"
          >
            {change.text}
          </span>
        )}
      </div>
      {note && <p className={`mt-2 text-xs ${highlight ? "text-white/75" : "text-gray"}`}>{note}</p>}
    </div>
  );
}

/** Visits per day as bars; page views in the tooltip. */
export function DailyChart({ points }: { points: DayPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.visits));
  const labelEvery = Math.max(1, Math.ceil(points.length / 7));
  const total = points.reduce((sum, p) => sum + p.visits, 0);
  return (
    <figure aria-label={`Visits per day: ${fmtInt(total)} in total`}>
      <div className="relative h-48">
        {[1, 0.5, 0].map((f) => (
          <div key={f} className="absolute inset-x-0 border-t border-dashed border-cream-dark" style={{ top: `${(1 - f) * 100}%` }}>
            <span className="absolute -top-2.5 right-0 bg-white pl-1 text-[10px] text-gray-light">{fmtInt(max * f)}</span>
          </div>
        ))}
        <div className="absolute inset-0 right-8 flex items-end gap-[2px]">
          {points.map((p) => (
            <div key={p.day} className="group relative flex-1 h-full flex items-end">
              <div
                className="w-full rounded-t-[3px] bg-navy/85 group-hover:bg-gold transition-colors"
                style={{ height: `${p.visits === 0 ? 0 : Math.max(3, (p.visits / max) * 100)}%` }}
                title={`${fmtDay(p.day)}: ${fmtInt(p.visits)} visits, ${fmtInt(p.pageviews)} page views`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 mr-8 flex gap-[2px] text-[10px] text-gray">
        {points.map((p, i) => (
          <span key={p.day} className="flex-1 text-center whitespace-nowrap overflow-visible">
            {i % labelEvery === 0 ? fmtDay(p.day) : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}

export function Funnel({ steps }: { steps: FunnelStep[] }) {
  const top = Math.max(1, steps[0]?.visits ?? 0);
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => {
        const share = step.visits / top;
        const fromPrevious = i > 0 && steps[i - 1].visits > 0 ? step.visits / steps[i - 1].visits : null;
        return (
          <li key={step.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-dark">
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cream text-[11px] font-semibold text-navy">
                  {i + 1}
                </span>
                {step.label}
              </span>
              <span className="shrink-0 font-semibold text-navy">
                {fmtInt(step.visits)} <span className="font-normal text-gray">· {fmtPct(share)}</span>
              </span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-cream overflow-hidden">
              <div
                className={`h-full rounded-full ${i === steps.length - 1 ? "bg-gold" : "bg-navy"}`}
                style={{ width: `${Math.max(step.visits ? 2 : 0, share * 100)}%` }}
              />
            </div>
            {fromPrevious !== null && (
              <p className="mt-1 text-[11px] text-gray">{fmtPct(fromPrevious)} of the step before</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export type BarRow = { key: string; label: string; sub?: string; value: number; display?: string; extra?: string };

/** A ranked list with a light bar behind each row. */
export function BarList({ rows, empty = "Nothing yet in this period." }: { rows: BarRow[]; empty?: string }) {
  if (rows.length === 0) return <p className="text-sm text-gray">{empty}</p>;
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-1.5">
      {rows.map((row) => (
        <li key={row.key} className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-y-0 left-0 bg-cream" style={{ width: `${(row.value / max) * 100}%` }} aria-hidden="true" />
          <div className="relative flex items-center justify-between gap-3 px-3 py-2 text-sm">
            <span className="min-w-0">
              <span className="block truncate text-dark">{row.label}</span>
              {row.sub && <span className="block truncate text-[11px] text-gray">{row.sub}</span>}
            </span>
            <span className="shrink-0 text-right">
              <span className="font-semibold text-navy">{row.display ?? fmtInt(row.value)}</span>
              {row.extra && <span className="block text-[11px] text-gray">{row.extra}</span>}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "gold" | "green" | "navy" }) {
  const tones = {
    neutral: "bg-gray-lighter text-gray",
    gold: "bg-gold/20 text-gold-ink",
    green: "bg-emerald-50 text-emerald-700",
    navy: "bg-navy text-white",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

/** One visit: when, from where, on what device, and every step in order. */
export function JourneyCard({ journey, open = false }: { journey: Journey; open?: boolean }) {
  const place = [journey.city, journey.region].filter(Boolean).join(", ");
  const start = journey.started.getTime();
  return (
    <details open={open} className="group rounded-xl border border-cream-dark/70 bg-white open:shadow-sm">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 marker:hidden">
        <span className="text-sm font-semibold text-navy w-32 shrink-0">{fmtDateTime(journey.started)}</span>
        <Badge>{sourceName(journey.source)}</Badge>
        {journey.campaign && <Badge tone="gold">{journey.campaign}</Badge>}
        <span className="text-xs text-gray">{deviceName(journey.device)}</span>
        {place && <span className="text-xs text-gray">· {place}</span>}
        <span className="text-xs text-gray">
          · {fmtInt(journey.pages)} {journey.pages === 1 ? "page" : "pages"} · {fmtDuration(journey.seconds)}
        </span>
        <span className="ml-auto flex items-center gap-2">
          {journey.sentForm && <Badge tone="green">Sent a request</Badge>}
          {journey.called && <Badge tone="green">Tapped call</Badge>}
          <span className="text-gray-light transition-transform group-open:rotate-90" aria-hidden="true">›</span>
        </span>
      </summary>
      <ol className="border-t border-cream-dark/60 px-4 py-3 space-y-2">
        {journey.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="w-12 shrink-0 text-right font-mono text-[11px] leading-5 text-gray-light">
              {fmtOffset(new Date(step.ts).getTime() - start)}
            </span>
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                step.type === "pageview" ? "bg-navy" : step.type === "form_sent" ? "bg-emerald-500" : "bg-gold"
              }`}
              aria-hidden="true"
            />
            <span className={step.type === "pageview" ? "text-dark" : "text-gray"}>{stepText(step)}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}

export function RangeTabs({ basePath, current, extra = {} }: { basePath: string; current: number; extra?: Record<string, string> }) {
  return (
    <nav aria-label="Date range" className="inline-flex rounded-full bg-white p-1 border border-cream-dark/70 shadow-sm">
      {[7, 30, 90].map((days) => {
        const query = new URLSearchParams({ ...extra, range: String(days) }).toString();
        const active = days === current;
        return (
          <Link
            key={days}
            href={`${basePath}?${query}`}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active ? "bg-navy text-white" : "text-navy hover:bg-cream"
            }`}
          >
            {days} days
          </Link>
        );
      })}
    </nav>
  );
}

export function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gold/40 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl text-navy">{title}</h2>
      <div className="mt-2 space-y-2 text-sm text-gray leading-relaxed">{children}</div>
    </div>
  );
}
