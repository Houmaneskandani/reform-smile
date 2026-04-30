"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Hide footer on consultation landing page and clinical homepage
  if (pathname === "/consultation" || pathname === "/") return null;

  return <Footer />;
}
