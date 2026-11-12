import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

// Served at /robots.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    // /keystatic is the website editor (also noindex via headers and metadata).
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/keystatic"] },
    sitemap: new URL("/sitemap.xml", SITE_CONFIG.url).toString(),
  };
}
