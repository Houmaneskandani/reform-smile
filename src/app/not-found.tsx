import SiteChrome from "@/components/layout/SiteChrome";
import NotFoundMessage from "@/components/NotFoundMessage";
// Imported after the components, like src/app/(site)/layout.tsx, to keep the same CSS order.
import "./globals.css";

// Site-wide 404 for unknown URLs (and notFound() outside the (site) group). Only the root
// not-found handles unmatched URLs, and the root layout has no chrome or CSS of its own, so
// this file brings both. A notFound() inside a public page is caught by
// src/app/(site)/not-found.tsx instead, which skips the chrome its layout already renders.
// Next.js sends this tree with every page's payload, so keep it small.
//
// No content check here (validateContent): Next.js loads this module for every route,
// /keystatic included, so a check here would turn invalid content into a 500 on the editor
// that is needed to fix it. The (site) layout's check already fails `next build`.
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundMessage />
    </SiteChrome>
  );
}
