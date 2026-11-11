"use client";

import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const variants = {
  primary:
    "bg-navy text-white hover:bg-navy-light shadow-lg hover:shadow-xl",
  secondary:
    "bg-white text-navy border-2 border-navy hover:bg-navy hover:text-white",
  outline:
    "bg-transparent text-white border-2 border-white hover:bg-white hover:text-navy",
  gold: "bg-gold text-white hover:bg-gold-dark shadow-lg hover:shadow-xl",
};

const sizes = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-base",
  lg: "px-9 py-4 text-lg",
};

// The /consultation page has its own layout, and Next's client-side <Link> crashes when
// navigating across layouts — so it (and external, phone and email links) get a plain <a>.
function needsPlainAnchor(href: string) {
  return (
    href === "/consultation" ||
    href.startsWith("/consultation?") ||
    href.startsWith("/consultation#") ||
    /^(https?:|tel:|mailto:)/.test(href)
  );
}

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 tracking-wide cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2";
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    if (needsPlainAnchor(href)) {
      return (
        <a href={href} onClick={onClick} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
