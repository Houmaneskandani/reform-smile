import type { NextConfig } from "next";

type Redirects = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

// The website editor (/keystatic) is never indexed by search engines or cached.
const editorHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Cache-Control", value: "no-store" },
];

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The website editor's own subdomain, from ADMIN_HOST (Vercel Production only, e.g.
 * ADMIN_HOST=admin.reformdentalimplantcenter.com), or undefined while it is unset.
 */
function readAdminHost(): string | undefined {
  const adminHost = process.env.ADMIN_HOST?.trim().toLowerCase();
  if (!adminHost) return undefined;
  if (!/^admin\.[a-z0-9.-]+\.[a-z]{2,}$/.test(adminHost)) {
    throw new Error(
      `ADMIN_HOST must be a bare host name that starts with "admin.", like admin.example.com (got "${adminHost}").`
    );
  }
  return adminHost;
}

const ADMIN_HOST = readAdminHost();

/**
 * Moves the website editor to its own subdomain once ADMIN_HOST is set. Its own origin keeps
 * the editor's sign-in token away from the public site's third-party tags. Unset = no redirects.
 *   admin.<domain>/            -> /keystatic
 *   admin.<domain>/<anything>  -> https://<domain>/<anything>   (the public site)
 *   /keystatic on other hosts  -> https://admin.<domain>/keystatic
 * Only /keystatic, /keystatic/... and /_next/... stay on the admin host, so no page with the
 * site's trackers, chat widget or cookie banner is served there. The exclusion ends at a "/" or
 * the end of the path, so /keystatic-x is sent to the main site too, and the routes are matched
 * case-sensitively (caseSensitiveRoutes below), so /KEYSTATIC, which is only a 404 page, is sent
 * there as well. One gap is Next.js's own: it never applies redirects to paths that start with
 * /_next (e.g. /_nextfoo), which therefore show the site's 404 on the admin host. That is why
 * src/components/GoogleAnalytics.tsx also refuses to load any tag on an "admin." host.
 */
function adminHostRedirects(adminHost: string | undefined): Redirects {
  if (!adminHost) return [];
  const mainHost = adminHost.slice("admin.".length);
  const onAdminHost = [{ type: "host" as const, value: escapeRegExp(adminHost) }];
  return [
    { source: "/", has: onAdminHost, destination: "/keystatic", permanent: false },
    {
      source: "/:path((?!keystatic(?:/|$)|_next/).*)",
      has: onAdminHost,
      destination: `https://${mainHost}/:path`,
      permanent: false,
    },
    {
      source: "/keystatic",
      missing: onAdminHost,
      destination: `https://${adminHost}/keystatic`,
      permanent: false,
    },
    {
      source: "/keystatic/:path*",
      missing: onAdminHost,
      destination: `https://${adminHost}/keystatic/:path*`,
      permanent: false,
    },
  ];
}

const nextConfig: NextConfig = {
  // `npm run dev:admin` serves the editor on http://127.0.0.1:3000.
  allowedDevOrigins: ["127.0.0.1"],
  // Next.js matches redirects and headers case-insensitively by default, while page URLs are
  // case-sensitive. The admin-host redirects need exact matching (see adminHostRedirects), so
  // this is switched on together with them; while ADMIN_HOST is unset nothing changes.
  ...(ADMIN_HOST ? { experimental: { caseSensitiveRoutes: true } } : {}),
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/keystatic", headers: editorHeaders },
      { source: "/keystatic/:path*", headers: editorHeaders },
      // The admin dashboard: never indexed, never cached (it shows live statistics).
      { source: "/admin", headers: editorHeaders },
      { source: "/admin/:path*", headers: editorHeaders },
    ];
  },
  async redirects() {
    return adminHostRedirects(ADMIN_HOST);
  },
};

export default nextConfig;
