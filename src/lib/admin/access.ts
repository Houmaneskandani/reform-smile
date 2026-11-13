import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { LOCAL_EDITOR_ENABLED } from "@/app/keystatic/local-mode";

// Who may open the admin dashboard (/admin). See CLAUDE.md → "Admin dashboard".
//
// - Live site: Clerk sign-in (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY, added by
//   Vercel's Clerk integration), AND the signed-in person's verified email must be listed in
//   ADMIN_EMAILS. Signing in alone is not enough, so even if Clerk's sign-up were left open,
//   strangers would see "no access".
// - This computer: under `npm run dev:admin` only (listens on 127.0.0.1, like the website
//   editor), the dashboard opens without signing in, for previewing it. Never in production.
// - Otherwise /admin is a 404.

export const CLERK_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);
const LOCAL_PREVIEW = !CLERK_CONFIGURED && LOCAL_EDITOR_ENABLED;
export const ADMIN_ENABLED = CLERK_CONFIGURED || LOCAL_PREVIEW;

export type AdminAccess =
  | { status: "allowed"; mode: "clerk"; email: string }
  | { status: "allowed"; mode: "local" }
  | { status: "denied"; email: string | null; reason: "not-listed" | "no-list" };

/** The emails allowed in, from ADMIN_EMAILS (comma-separated, any case). */
function allowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

const LOCAL_HOSTS = /^(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/;

/** Checks the visitor and returns their access, or sends them to sign in / a 404. */
export async function getAdminAccess(): Promise<AdminAccess> {
  if (!ADMIN_ENABLED) notFound();

  if (LOCAL_PREVIEW) {
    // dev:admin listens on 127.0.0.1 only; this also refuses requests addressed to another
    // host name (DNS rebinding from another website).
    const host = (await headers()).get("host") ?? "";
    if (!LOCAL_HOSTS.test(host)) notFound();
    return { status: "allowed", mode: "local" };
  }

  const user = await currentUser();
  if (!user) redirect("/admin/sign-in");

  const verified = user.emailAddresses
    .filter((address) => address.verification?.status === "verified")
    .map((address) => address.emailAddress.toLowerCase());
  const primary = verified[0] ?? null;
  const allowed = allowedEmails();
  if (allowed.length === 0) return { status: "denied", email: primary, reason: "no-list" };
  const match = verified.find((email) => allowed.includes(email));
  if (!match) return { status: "denied", email: primary, reason: "not-listed" };
  return { status: "allowed", mode: "clerk", email: match };
}
