import type { Metadata } from "next";
import BookHero from "./BookHero";
import BookForm from "./BookForm";
import { leadForwardingEnabled } from "@/lib/server/lead-forwarding";

export const metadata: Metadata = {
  title: "Book an Appointment",
  alternates: { canonical: "/book" },
  description:
    "Schedule your dental implant appointment at Reform Dental & Implant Center.",
};

export default function BookPage() {
  return (
    <>
      <BookHero />
      <BookForm leadForm={leadForwardingEnabled() ? "book" : undefined} />
    </>
  );
}
