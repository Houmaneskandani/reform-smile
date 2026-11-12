import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SITE_CONFIG } from "@/lib/constants";

// Root layout: only fonts, metadata, viewport and <html>/<body>. It deliberately does not
// import globals.css or render the site chrome (header, footer, trackers, chat, cookie banner):
// public pages get those from src/app/(site)/layout.tsx and the 404 from src/app/not-found.tsx.
// The body classes stay here so the public HTML is unchanged; without the CSS they do nothing.

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "Reform Smile & Dental Implant Center",
    template: "%s | Reform Smile & Dental Implant Center",
  },
  description:
    "Reform Smile & Dental Implant Center specializes in All-on-X dental implants and full arch restorations. Transform your smile with permanent, natural-looking results. Schedule your free consultation today.",
  keywords: [
    "dental implants",
    "All-on-4",
    "All-on-6",
    "All-on-X",
    "full arch dental implants",
    "teeth in a day",
    "dental implant center",
    "Reform Smile",
    "snap-on dentures",
    "dental veneers",
    "missing teeth",
    "dental surgeon",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Reform Smile & Dental Implant Center",
    title: "Reform Smile & Dental Implant Center",
    description:
      "Specializing in All-on-X dental implants and full arch restorations. Transform your smile at Reform Smile.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Reform Smile & Dental Implant Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reform Smile & Dental Implant Center",
    description:
      "Specializing in All-on-X dental implants and full arch restorations.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1B3A5C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-body">{children}</body>
    </html>
  );
}
