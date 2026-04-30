import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Reform Smile & Dental Implant Center",
    title: "Reform Smile & Dental Implant Center | Dr. Ava Pournejad, DDS",
    description:
      "Specializing in All-on-X dental implants and full arch restorations. Transform your smile with Dr. Ava Pournejad.",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
