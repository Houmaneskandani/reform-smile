import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

// Served at /robots.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", SITE_CONFIG.url).toString(),
  };
}
