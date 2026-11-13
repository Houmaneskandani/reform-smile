"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sendSiteEvent } from "@/lib/analytics/client";

// Records the site's own anonymous visit statistics (see src/lib/analytics/client.ts for what is
// sent and what never is): a page view on every page, clicks on links and buttons, how far each
// page is scrolled (25/50/75/100%), and how long it was looked at. Rendered once by SiteChrome,
// so it runs on every public page and never in the website editor.

const SCROLL_STEPS = [25, 50, 75, 100];
const MAX_SECONDS = 3600;

/** What was clicked, in a few words, e.g. "link:/consultation", "call", "out:instagram.com". */
function describeTarget(element: HTMLElement): string {
  const tagged = element.closest<HTMLElement>("[data-track]");
  if (tagged?.dataset.track) return tagged.dataset.track;

  if (element instanceof HTMLAnchorElement) {
    const href = element.getAttribute("href") ?? "";
    if (href.startsWith("tel:")) return "call";
    if (href.startsWith("mailto:")) return "email";
    try {
      const url = new URL(href, window.location.href);
      if (url.host !== window.location.host) return `out:${url.host.replace(/^www\./, "")}`;
      return `link:${url.pathname}`;
    } catch {
      return "link";
    }
  }
  return "button";
}

/** "ABOUT US" → "About Us": menu links are styled in capitals, and innerText returns them so. */
function unshout(text: string): string {
  if (text.length < 4 || /[a-z]/.test(text) || !/[A-Z]{2}/.test(text)) return text;
  return text.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

/** The visible words of the button or link (site text, never anything a visitor typed). */
function describeLabel(element: HTMLElement): string | undefined {
  const text = (element.getAttribute("aria-label") || element.innerText || "").replace(/\s+/g, " ").trim();
  return text ? unshout(text).slice(0, 80) : undefined;
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const visibleSince = useRef<number | null>(null);
  const secondsOnPage = useRef(0);
  const scrollStepsSent = useRef(new Set<number>());

  // One page view per page; time on page and scroll depth start over on every page.
  useEffect(() => {
    if (!pathname) return;
    sendSiteEvent({ type: "pageview", path: pathname });
    secondsOnPage.current = 0;
    visibleSince.current = document.visibilityState === "visible" ? Date.now() : null;
    scrollStepsSent.current = new Set();

    const flushTime = () => {
      if (visibleSince.current !== null) {
        secondsOnPage.current += (Date.now() - visibleSince.current) / 1000;
        visibleSince.current = null;
      }
      const seconds = Math.min(MAX_SECONDS, Math.round(secondsOnPage.current));
      if (seconds > 0) sendSiteEvent({ type: "time", path: pathname, value: seconds });
      secondsOnPage.current = 0;
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushTime();
      else visibleSince.current = Date.now();
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const percent = scrollable <= 0 ? 100 : ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
        for (const step of SCROLL_STEPS) {
          const reached = step === 100 ? percent >= 98 : percent >= step;
          if (reached && !scrollStepsSent.current.has(step)) {
            scrollStepsSent.current.add(step);
            sendSiteEvent({ type: "scroll", path: pathname, value: step });
          }
        }
      });
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flushTime);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      // Leaving this page for another one on the site.
      flushTime();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flushTime);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  // Clicks on links and buttons, anywhere on the page.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const element = (event.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-track]");
      if (!element) return;
      sendSiteEvent({ type: "click", target: describeTarget(element), label: describeLabel(element) });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
