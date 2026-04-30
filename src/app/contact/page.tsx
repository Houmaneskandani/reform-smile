import type { Metadata } from "next";
import ContactHero from "./ContactHero";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Reform Smile & Dental Implant Center. Schedule your free consultation with Dr. Ava Pournejad today.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactContent />
    </>
  );
}
