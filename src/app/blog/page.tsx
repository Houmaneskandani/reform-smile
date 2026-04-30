import type { Metadata } from "next";
import BlogHero from "./BlogHero";
import BlogList from "./BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Expert dental implant articles, patient education, and oral health tips from Dr. Ava Pournejad at Reform Smile & Dental Implant Center.",
};

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogList />
    </>
  );
}
