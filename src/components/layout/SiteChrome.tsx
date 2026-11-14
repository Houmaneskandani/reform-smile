import Header from "@/components/layout/Header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import StructuredData from "@/components/StructuredData";
import StickyBookNow from "@/components/ui/StickyBookNow";
import AIChatAssistant from "@/components/AIChatAssistant";
import CookieConsent from "@/components/CookieConsent";
import SmoothScroll from "@/components/SmoothScroll";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import VisitorTracker from "@/components/VisitorTracker";

// Everything the public site wraps around a page: the site's own anonymous visit statistics,
// third-party trackers (after cookie consent),
// smooth scrolling, Google structured data, header, footer, the sticky "Book Now" bar, the chat
// widget and the cookie banner. Used by src/app/(site)/layout.tsx and the site-wide 404
// (src/app/not-found.tsx), so both stay identical. Routes outside the (site) group (for example
// a future admin editor) get none of this. Keep the order: it is the order of the page's HTML.
export default function SiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GoogleAnalytics />
      <VisitorTracker />
      <SmoothScroll />
      <StructuredData />
      {/* Keyboard users can jump past the header straight to the page (WCAG 2.4.1). */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-xl"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <FooterWrapper />
      <StickyBookNow />
      <AIChatAssistant />
      <CookieConsent />
    </>
  );
}
