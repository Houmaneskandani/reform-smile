import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import StructuredData from "@/components/StructuredData";
import StickyBookNow from "@/components/ui/StickyBookNow";
import AIChatAssistant from "@/components/AIChatAssistant";
import CookieConsent from "@/components/CookieConsent";
import SmoothScroll from "@/components/SmoothScroll";
import IntroSequence from "@/components/IntroSequence";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

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
  metadataBase: new URL("https://ava-green.vercel.app"),
  title: {
    default: "Reform Smile & Dental Implant Center | Dr. Ava Pournejad, DDS",
    template: "%s | Reform Smile & Dental Implant Center",
  },
  description:
    "Dr. Ava Pournejad specializes in All-on-X dental implants and full arch restorations. Transform your smile with permanent, natural-looking results. Schedule your free consultation today.",
  keywords: [
    "dental implants",
    "All-on-4",
    "All-on-6",
    "All-on-X",
    "full arch dental implants",
    "teeth in a day",
    "dental implant center",
    "Dr. Ava Pournejad",
    "Reform Smile",
    "missing teeth",
    "dental surgeon",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#1B3A5C",
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Reform Smile & Dental Implant Center",
    title: "Reform Smile & Dental Implant Center | Dr. Ava Pournejad, DDS",
    description:
      "Specializing in All-on-X dental implants and full arch restorations. Transform your smile with Dr. Ava Pournejad.",
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
    title: "Reform Smile & Dental Implant Center | Dr. Ava Pournejad, DDS",
    description:
      "Specializing in All-on-X dental implants and full arch restorations.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-body">
        <GoogleAnalytics />
        <IntroSequence />
        <SmoothScroll />
        <StructuredData />
        <Header />
        <main className="flex-1">{children}</main>
        <FooterWrapper />
        <StickyBookNow />
        <AIChatAssistant />
        <CookieConsent />
      </body>
    </html>
  );
}
