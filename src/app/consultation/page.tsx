import type { Metadata } from "next";
import ConsultationPage from "./ConsultationPage";

export const metadata: Metadata = {
  title: "Schedule Your Free Consultation",
  description:
    "Book your free dental implant consultation with Dr. Ava Pournejad. Get a comprehensive exam, 3D imaging, and personalized treatment plan at no cost.",
};

export default function Page() {
  return <ConsultationPage />;
}
