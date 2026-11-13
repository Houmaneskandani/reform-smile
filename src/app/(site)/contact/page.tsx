import type { Metadata } from "next";
import ContactHero from "./ContactHero";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  alternates: { canonical: "/contact" },
  description:
    "Get in touch with Reform Dental & Implant Center. Schedule your free consultation today.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactContent />
    </>
  );
}
