"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/referrals", label: "Referrals" },
  { href: "/account/affiliate", label: "Affiliate" },
];

export function AccountNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const allLinks = isAdmin
    ? [...links, { href: "/account/subscribers", label: "Subscribers" }]
    : links;

  return (
    <nav className="flex flex-wrap gap-2">
      {allLinks.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              active
                ? "border-steel-500 bg-steel-700/30 text-fg"
                : "border-border text-fg-muted hover:border-steel-500/50 hover:text-fg"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
