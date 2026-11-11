import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

// Served at /sitemap.xml. URLs follow SITE_CONFIG.url, so switching to the
// custom domain only needs a change in src/lib/constants.ts.
const PAGES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/book", changeFrequency: "monthly", priority: 0.8 },
  { path: "/consultation", changeFrequency: "monthly", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, SITE_CONFIG.url).toString(),
    changeFrequency,
    priority,
  }));
}
