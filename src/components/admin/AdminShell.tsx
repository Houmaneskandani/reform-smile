import Image from "next/image";
import type { ReactNode } from "react";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import type { AdminAccess } from "@/lib/admin/access";
import AdminNav from "./AdminNav";

// The frame around every admin page: a navy sidebar with the logo (a top bar on phones),
// and a cream work area. Only allowed visitors get past it.

export default function AdminShell({ access, children }: { access: AdminAccess; children: ReactNode }) {
  if (access.status === "denied") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-cream-dark/70 p-8 text-center">
          <Image src="/logo-on-light.png" alt="Reform Dental & Implant Center" width={900} height={445} sizes="180px" className="h-20 w-auto mx-auto mb-6" />
          <h1 className="font-heading text-2xl text-navy mb-2">No access to the dashboard</h1>
          <p className="text-gray text-sm mb-6">
            {access.reason === "no-list"
              ? "No one has been given access yet (ADMIN_EMAILS is empty)."
              : `${access.email ?? "This account"} isn't on the list of people who can open the dashboard.`}{" "}
            Ask the site administrator to add your email.
          </p>
          <SignOutButton redirectUrl="/admin/sign-in">
            <button type="button" className="rounded-full bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 text-sm cursor-pointer">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-dark">
      <aside className="bg-navy text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex lg:flex-col">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-7">
          <a href="/admin" className="block">
            <Image src="/logo-on-dark.png" alt="Reform Dental & Implant Center" width={900} height={445} sizes="200px" priority className="h-12 lg:h-16 w-auto" />
          </a>
          <div className="lg:hidden">{access.mode === "clerk" ? <UserButton /> : <LocalBadge />}</div>
        </div>
        <div className="px-3 pb-3 lg:flex-1 lg:px-4 overflow-x-auto">
          <AdminNav />
        </div>
        <div className="hidden lg:flex items-center gap-3 border-t border-white/10 px-6 py-5">
          {access.mode === "clerk" ? (
            <>
              <UserButton />
              <span className="min-w-0 truncate text-xs text-white/75" title={access.email}>
                {access.email}
              </span>
            </>
          ) : (
            <LocalBadge />
          )}
        </div>
      </aside>
      <div className="lg:pl-64">
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</main>
        <footer className="mx-auto max-w-7xl px-4 pb-10 md:px-8 text-[11px] text-gray">
          Anonymous statistics: no names, contact details or IP addresses are stored. Times are Pacific time.
        </footer>
      </div>
    </div>
  );
}

function LocalBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-gold/20 px-3 py-1 text-[11px] font-semibold text-gold-ink" title="Opened with npm run dev:admin on this computer, without signing in">
      Local preview
    </span>
  );
}
