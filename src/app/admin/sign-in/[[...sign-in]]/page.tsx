import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { CLERK_CONFIGURED } from "@/lib/admin/access";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  if (!CLERK_CONFIGURED) notFound();
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      <div className="hidden lg:flex flex-col justify-between bg-navy p-12 text-white">
        <Image src="/logo-on-dark.png" alt="Reform Dental & Implant Center" width={900} height={445} sizes="260px" priority className="h-24 w-auto self-start" />
        <div>
          <p className="text-gold-ink font-semibold tracking-widest uppercase text-xs mb-3">Practice dashboard</p>
          <h1 className="font-heading text-4xl leading-tight">See how patients find and use your website.</h1>
          <p className="mt-4 max-w-md text-white/75">
            Visits, sources, the pages people read and the buttons they tap: anonymous statistics,
            for the practice team only.
          </p>
        </div>
        <p className="text-xs text-white/60">Only invited team members can sign in.</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-8 p-6">
        <Image src="/logo-on-light.png" alt="Reform Dental & Implant Center" width={900} height={445} sizes="200px" priority className="h-20 w-auto lg:hidden" />
        <SignIn
          path="/admin/sign-in"
          routing="path"
          forceRedirectUrl="/admin"
          appearance={{ elements: { footerAction: { display: "none" } } }}
        />
      </div>
    </div>
  );
}
