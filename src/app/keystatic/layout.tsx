import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KeystaticApp from "./keystatic";
import { LOCAL_EDITOR_ENABLED } from "./local-mode";

// The website editor at /keystatic (config in keystatic.config.ts). It sits outside the (site)
// route group on purpose: no site CSS, header, footer, analytics, chat widget or cookie banner
// load here.
//
// It is available under `npm run dev:admin` (local storage, no sign-in, listens on this
// computer only; see ./local-mode.ts) and, in production, only once a Keystatic Cloud project
// is configured (NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT), where editors must sign in. Otherwise,
// plain `npm run dev` included, it is a 404. In production both are fixed when the site is built.
const enabled = Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT) || LOCAL_EDITOR_ENABLED;

export const metadata: Metadata = {
  // While the editor is off, the 404 here is titled like any other missing page.
  ...(enabled ? { title: "Website editor" } : {}),
  robots: { index: false, follow: false },
};

export default function KeystaticLayout() {
  if (!enabled) {
    if (process.env.NODE_ENV === "development") {
      console.warn("The website editor (/keystatic) runs only under `npm run dev:admin`.");
    }
    notFound();
  }

  // The editor renders every /keystatic/... screen itself; the page segment renders nothing.
  return <KeystaticApp />;
}
