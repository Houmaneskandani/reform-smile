"use client";

import Script from "next/script";
import { SITE_CONFIG } from "@/lib/constants";
import { useCookieConsent } from "@/components/CookieConsent";

// Treat empty values and the placeholders from .env.example ("G-XXXXXXXXXX",
// "your_..._here") as "not configured", so a copied example file never loads a fake tag.
function configuredId(value: string | undefined) {
  const id = value?.trim() ?? "";
  if (!id || /X{4,}/.test(id) || id.toLowerCase().startsWith("your_")) return "";
  return id;
}

const GA_ID = configuredId(SITE_CONFIG.gaTrackingId);
const GTM_ID = configuredId(process.env.NEXT_PUBLIC_GTM_ID);
const CLARITY_ID = configuredId(process.env.NEXT_PUBLIC_CLARITY_ID);
const FB_PIXEL_ID = configuredId(process.env.NEXT_PUBLIC_FB_PIXEL_ID);

// Global Privacy Control: a browser setting that asks sites not to sell or share the
// visitor's data for advertising.
function hasGlobalPrivacyControl() {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/**
 * Loads every analytics and marketing tag (Google Analytics, Google Tag Manager,
 * Microsoft Clarity, Meta Pixel) — but only once the visitor has accepted cookies.
 * Nothing loads before that or after "Decline". Accepting in the cookie banner loads
 * the tags right away, without a page reload; returning visitors who accepted get
 * them on every page load. The Meta Pixel (ad tracking) also stays off for browsers
 * that send Global Privacy Control.
 */
export default function GoogleAnalytics() {
  const consent = useCookieConsent();

  // Only "accepted" on the client: the server and the hydration render see undefined.
  if (consent !== "accepted") return null;

  // Never on the website editor's own subdomain (ADMIN_HOST in next.config.ts, which must start
  // with "admin."): the editor's sign-in token is in that origin's storage. Its redirects send
  // every other page to the main site, but Next.js never redirects paths that start with
  // /_next, so a URL like admin.<domain>/_nextfoo still shows the site's 404 page there.
  if (window.location.hostname.startsWith("admin.")) return null;

  const loadMetaPixel = FB_PIXEL_ID !== "" && !hasGlobalPrivacyControl();

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(GA_ID)});
            `}
          </Script>
        </>
      )}

      {GTM_ID && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});
          `}
        </Script>
      )}

      {CLARITY_ID && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)});
          `}
        </Script>
      )}

      {loadMetaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${JSON.stringify(FB_PIXEL_ID)});
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
