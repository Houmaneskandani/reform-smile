"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ExternalLink, Footprints, PencilLine } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/journeys", label: "Visitor journeys", icon: Footprints },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboard" className="flex gap-1 lg:flex-col">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-white/12 text-white" : "text-white/75 hover:bg-white/8 hover:text-white"
            }`}
          >
            <Icon size={18} aria-hidden="true" className={active ? "text-gold-ink" : ""} />
            {label}
          </Link>
        );
      })}
      <div className="hidden lg:block my-3 border-t border-white/10" />
      {/* A plain link on purpose: the editor is a separate app with its own layout. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/keystatic"
        className="hidden lg:flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/8 hover:text-white"
      >
        <PencilLine size={18} aria-hidden="true" />
        Website editor
      </a>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/8 hover:text-white"
      >
        <ExternalLink size={18} aria-hidden="true" />
        View website
      </a>
    </nav>
  );
}
