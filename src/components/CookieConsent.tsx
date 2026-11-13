"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStickyBookNowVisible } from "@/components/ui/StickyBookNow";

// src/lib/tracking.ts reads this key directly — keep the key and its values unchanged.
export const CONSENT_STORAGE_KEY = "cookie-consent";
export type CookieConsentChoice = "accepted" | "declined";

const CONSENT_CHANGE_EVENT = "cookie-consent-change";
// Sent by the "Cookie settings" link to show the banner again
const OPEN_SETTINGS_EVENT = "cookie-consent-open";
// Wait before showing the banner so it doesn't compete with the intro
const BANNER_DELAY_MS = 2500;
// First-party cookies set by Google Analytics / Google Ads, the Meta Pixel and Microsoft Clarity
const TRACKING_COOKIE_PATTERN = /^(_ga|_gid|_gcl_|_fbp|_fbc|_clck|_clsk)/;

// Used when storage is blocked, so the banner still closes for the rest of the visit.
let choiceInMemory: CookieConsentChoice | null = null;

/**
 * The visitor's current cookie choice, outside React (e.g. before firing a tracking
 * event). null when they haven't answered. Safe when storage is blocked.
 */
export function readConsent(): CookieConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === "accepted" || stored === "declined") return stored;
  } catch {
    // Storage blocked — fall back to the in-memory choice.
  }
  return choiceInMemory;
}

function saveConsent(choice: CookieConsentChoice) {
  choiceInMemory = choice;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked — the in-memory choice still applies to this visit.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

// The tags write their cookies on the site's domain or a parent domain (".example.com"),
// so each one is expired on every level of the current hostname.
function deleteTrackingCookies() {
  const labels = window.location.hostname.split(".");
  const domains = labels.map((_, i) => labels.slice(i).join("."));
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!TRACKING_COOKIE_PATTERN.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
    }
  }
}

function chooseConsent(choice: CookieConsentChoice) {
  const previous = readConsent();
  saveConsent(choice);
  // Withdrawing consent: tags that already loaded can't be removed from the open page,
  // so clear their cookies and reload the page without them.
  if (previous === "accepted" && choice === "declined") {
    deleteTrackingCookies();
    window.location.reload();
  }
}

/** Shows the cookie banner again, so the visitor can change or withdraw their choice. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

/** "Cookie settings" link (e.g. in the footer) that reopens the cookie banner. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}

function subscribeToConsent(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  // A choice made in another tab
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * The visitor's cookie choice: "accepted" or "declined", null while they haven't
 * answered yet, and undefined on the server and during hydration (not known yet).
 * Components re-render as soon as the visitor answers — no page reload needed.
 */
export function useCookieConsent(): CookieConsentChoice | null | undefined {
  return useSyncExternalStore(subscribeToConsent, readConsent, () => undefined);
}

export default function CookieConsent() {
  const consent = useCookieConsent();
  const stickyBarVisible = useStickyBookNowVisible();
  const [delayPassed, setDelayPassed] = useState(false);
  // Reopened from "Cookie settings" to change an earlier choice
  const [reopened, setReopened] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDelayPassed(true), BANNER_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const open = () => {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setReopened(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  // Opened from the footer: move keyboard and screen-reader focus to the banner
  useEffect(() => {
    if (reopened) dialogRef.current?.focus({ preventScroll: true });
  }, [reopened]);

  const choose = (choice: CookieConsentChoice) => {
    setReopened(false);
    chooseConsent(choice);
    returnFocusRef.current?.focus({ preventScroll: true });
    returnFocusRef.current = null;
  };

  const show = reopened || (consent === null && delayPassed);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          // Phones: compact card at the bottom of the screen, moved up to sit just above
          // the "Book Free Consultation" bar while that bar is showing.
          // Tablet/desktop: small card in the bottom-right corner (over the chat button).
          className={`fixed left-3 right-3 mx-auto max-w-lg md:left-auto md:right-5 md:bottom-5 md:mx-0 md:max-w-md z-[45] bg-white rounded-2xl shadow-2xl border border-gray-lighter p-4 md:p-6 focus:outline-none transition-[bottom] duration-300 ${
            stickyBarVisible ? "bottom-20" : "bottom-3"
          }`}
        >
          <p
            id="cookie-consent-title"
            className="text-navy font-semibold text-sm mb-1 md:mb-2"
          >
            Your Privacy Matters
          </p>
          <p
            id="cookie-consent-description"
            className="text-gray text-[13px] leading-snug md:leading-relaxed mb-3 md:mb-4"
          >
            {/* Both versions name what Accept turns on: analytics (incl. Clarity session
                recordings) and advertising (Meta Pixel), and how to change it later */}
            <span className="sm:hidden">
              We use cookies for analytics and advertising. You can change your choice anytime in
              Cookie settings.
            </span>
            <span className="hidden sm:inline">
              We use cookies for analytics and advertising to understand how you use our site and
              improve your experience. None of these load unless you accept, and you can change
              your choice anytime in Cookie settings.
            </span>
          </p>

          {/* Accept and Decline are deliberately the same size — declining must be as easy as accepting */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="bg-navy hover:bg-navy-light text-white font-semibold py-2.5 px-4 rounded-full text-sm transition-colors cursor-pointer"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => choose("declined")}
              className="border border-navy/25 hover:border-navy text-navy font-semibold py-2.5 px-4 rounded-full text-sm transition-colors cursor-pointer"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
