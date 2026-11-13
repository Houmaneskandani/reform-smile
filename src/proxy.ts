import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextMiddleware, type NextRequest } from "next/server";

// Next.js "proxy" (the former middleware). It runs ONLY on the admin dashboard (see `matcher`):
// the public website never loads or calls Clerk.
//
// With Clerk configured, every /admin page except the sign-in page requires a signed-in user;
// src/lib/admin/access.ts then also checks the email against ADMIN_EMAILS. Without Clerk, this
// does nothing and the admin layout decides (local preview under dev:admin, else a 404).

const CLERK_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);
const isSignInPage = createRouteMatcher(["/admin/sign-in(.*)"]);

// Created on first use, so a build without Clerk keys never touches Clerk.
let withClerk: NextMiddleware | null = null;

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!CLERK_CONFIGURED) return NextResponse.next();
  withClerk ??= clerkMiddleware(
    async (auth, req) => {
      if (!isSignInPage(req)) await auth.protect();
    },
    { signInUrl: "/admin/sign-in" }
  );
  return withClerk(request, event);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
