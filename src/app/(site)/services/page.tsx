import type { Metadata } from "next";
import ServicesHero from "./ServicesHero";
import ServicesList from "./ServicesList";
import CTASection from "@/components/sections/CTASection";
import { SITE_CONFIG } from "@/lib/constants";

const title = "Our Services";
const fullTitle = `${title} | ${SITE_CONFIG.name}`;
const description =
  "Full arch (All-on-X) and single dental implants, snap-on dentures, and porcelain veneers at Reform Smile. Start with a free consultation.";

// openGraph and twitter replace the root layout's objects rather than merging with them,
// so the shared fields (site name, type, image, card) are repeated here.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_CONFIG.name,
    title: fullTitle,
    description,
    url: "/services",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: fullTitle,
    description,
    images: ["/og-image.jpg"],
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <CTASection />
    </>
  );
}
