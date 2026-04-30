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
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 tracking-wide cursor-pointer";
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    // Use regular <a> for consultation page (different layout) to avoid client-nav crash
    if (href === "/consultation") {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
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
