import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { ADMIN_ENABLED, CLERK_CONFIGURED } from "@/lib/admin/access";

// The admin dashboard (/admin): visitor statistics for the practice. Outside the (site) route
// group, so none of the public site's header, footer, trackers, chat or cookie banner load
// here. Clerk loads only on these pages. See CLAUDE.md → "Admin dashboard".

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Reform Dental dashboard" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!ADMIN_ENABLED) notFound();
  if (!CLERK_CONFIGURED) return children;
  return (
    <ClerkProvider
      signInUrl="/admin/sign-in"
      afterSignOutUrl="/admin/sign-in"
      appearance={{
        variables: {
          colorPrimary: "#1B3A5C",
          colorForeground: "#1A1A2E",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          borderRadius: "0.75rem",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
