import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import ReviewFlow from "./ReviewFlow";

// The page patients are sent to (by link or QR code) to rate their visit.
// Not in the menu or the sitemap, and not for search engines.
export const metadata: Metadata = {
  title: "Rate Your Visit",
  description: `Tell ${SITE_CONFIG.name} how your visit went.`,
  alternates: { canonical: "/review" },
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  // Without the Google link the page could only collect private feedback, which is exactly
  // what a review page must not do (see ReviewFlow). So it doesn't exist until the link is
  // set in the editor (Practice info → Google review link). In development it still renders,
  // with a note, so the page can be worked on.
  if (!SITE_CONFIG.googleReviewUrl && process.env.NODE_ENV === "production") notFound();

  return <ReviewFlow googleReviewUrl={SITE_CONFIG.googleReviewUrl} />;
}
