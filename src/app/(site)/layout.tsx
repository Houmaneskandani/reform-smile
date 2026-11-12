import SiteChrome from "@/components/layout/SiteChrome";
// Imported after SiteChrome on purpose: the site's CSS order stays lenis.css (from SmoothScroll)
// first, then globals.css — the same order as before the (site) route group existed.
import "../globals.css";
import { validateContent } from "@/content/validate";

// Fails the build (and shows the error in `next dev`) if content/*.json is invalid. It runs only
// here, not in the root layout or the root not-found (both also load for /keystatic), so the
// website editor keeps working and can be used to fix the content.
validateContent();

// Layout for every public page. The root layout (src/app/layout.tsx) only sets up fonts,
// metadata and <html>/<body>; the site's styles and chrome live here so that routes outside
// this group don't load them.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteChrome>{children}</SiteChrome>;
}
