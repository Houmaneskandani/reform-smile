"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Calendar, MessageCircle, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

// Fired on window by the bar's chat button; AIChatAssistant listens and opens the chat.
export const OPEN_CHAT_EVENT = "reform:open-chat";

// The bar slides in once the visitor has scrolled past the hero
const SHOW_AFTER_SCROLL_PX = 600;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}
const getIsPastHero = () => window.scrollY > SHOW_AFTER_SCROLL_PX;
// The server can't know the scroll position, so it renders the bar hidden.
const getIsPastHeroOnServer = () => false;

/**
 * Whether the phone booking bar is showing (it is CSS-hidden from md up).
 * The cookie banner uses this to sit just above the bar instead of overlapping it.
 */
export function useStickyBookNowVisible() {
  const pathname = usePathname();
  const pastHero = useSyncExternalStore(
    subscribeToScroll,
    getIsPastHero,
    getIsPastHeroOnServer
  );
  // Not shown on the consultation page — the booking form is already right there.
  return pastHero && pathname !== "/consultation";
}

export default function StickyBookNow() {
  const visible = useStickyBookNowVisible();
  const pathname = usePathname();

  if (pathname === "/consultation") return null;

  return (
    <div
      // Off-screen links shouldn't be reachable by keyboard or screen readers
      inert={!visible}
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-navy/95 backdrop-blur-md border-t border-gold/20 px-4 py-3 flex gap-3">
        <a
          href="/consultation"
          className="flex-1 min-w-0 flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-navy-dark font-semibold py-3.5 rounded-full transition-colors text-sm whitespace-nowrap"
        >
          <Calendar size={16} aria-hidden="true" />
          {/* The full label doesn't fit next to two round buttons on the narrowest phones */}
          <span className="min-[350px]:hidden">Free Consultation</span>
          <span className="hidden min-[350px]:inline">Book Free Consultation</span>
        </a>
        <a
          href={`tel:${SITE_CONFIG.phone.replace(/[^0-9]/g, "")}`}
          className="flex items-center justify-center w-14 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          aria-label={`Call us at ${SITE_CONFIG.phone}`}
        >
          <Phone size={18} aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
          className="flex items-center justify-center w-14 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
          aria-label="Open chat"
        >
          <MessageCircle size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
