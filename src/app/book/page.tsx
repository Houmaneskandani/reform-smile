import type { Metadata } from "next";
import BookHero from "./BookHero";
import BookForm from "./BookForm";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your dental implant appointment with Dr. Ava Pournejad at Reform Smile & Dental Implant Center.",
};

export default function BookPage() {
  return (
    <>
      <BookHero />
      <BookForm />
    </>
  );
}
