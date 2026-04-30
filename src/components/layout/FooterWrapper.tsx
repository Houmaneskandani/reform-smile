"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Hide footer on consultation landing page
  if (pathname === "/consultation") return null;

  return <Footer />;
}
