import type { Metadata } from "next";
import ConsultationPage from "./ConsultationPage";
import { leadForwardingEnabled } from "@/lib/server/lead-forwarding";

export const metadata: Metadata = {
  title: "Schedule Your Free Consultation",
  alternates: { canonical: "/consultation" },
  description:
    "Book your free dental implant consultation at Reform Dental. Get a comprehensive exam, 3D imaging, and personalized treatment plan at no cost.",
};

export default function Page() {
  return <ConsultationPage leadForm={leadForwardingEnabled() ? "consultation" : undefined} />;
}
