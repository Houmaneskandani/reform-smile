import Header from "@/components/layout/Header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import StructuredData from "@/components/StructuredData";
import StickyBookNow from "@/components/ui/StickyBookNow";
import AIChatAssistant from "@/components/AIChatAssistant";
import CookieConsent from "@/components/CookieConsent";
import SmoothScroll from "@/components/SmoothScroll";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Everything the public site wraps around a page: trackers (after cookie consent),
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
      <SmoothScroll />
      <StructuredData />
      <Header />
      <main className="flex-1">{children}</main>
      <FooterWrapper />
      <StickyBookNow />
      <AIChatAssistant />
      <CookieConsent />
    </>
  );
}
