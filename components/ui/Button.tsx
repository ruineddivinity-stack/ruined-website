import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 text-black hover:brightness-110 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_24px_4px_rgba(195,204,211,0.45)]",
  secondary:
    "bg-surface-2 text-fg border border-border hover:border-steel-500 hover:bg-surface-3 hover:shadow-[0_0_20px_2px_rgba(86,134,172,0.35)]",
  ghost: "text-fg-muted hover:text-fg",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5";

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
