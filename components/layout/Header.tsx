import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CartButton } from "@/components/layout/CartButton";
import { GiftButton } from "@/components/layout/GiftButton";
import { AccountButton } from "@/components/layout/AccountButton";
import { MobileNav } from "@/components/layout/MobileNav";
import { getSession } from "@/lib/session";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/coa", label: "COAs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function Header() {
  const session = await getSession();

  return (
    <header className="relative bg-gradient-to-b from-surface/80 via-surface/25 to-transparent px-4 pb-4 pt-3 sm:pt-4">
      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full border border-steel-500/25 bg-surface/70 px-4 shadow-[0_0_30px_-6px_rgba(140,82,199,0.4)] backdrop-blur-xl sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="RUINED"
            width={2400}
            height={1027}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wide text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/affiliates"
            className="badge-holo hidden items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-chrome-100 backdrop-blur-md transition-transform duration-300 hover:scale-105 md:inline-flex"
          >
            <DollarIcon />
            Affiliates
          </Link>
          <Button
            href="/bundle"
            variant="secondary"
            className="!hidden whitespace-nowrap uppercase tracking-wide md:!inline-flex"
          >
            Bundle Builder
          </Button>
          <AccountButton href={session ? "/account" : "/login"} />
          <GiftButton />
          <CartButton />
          <MobileNav accountHref={session ? "/account" : "/login"} />
        </div>
      </div>
    </header>
  );
}

function DollarIcon() {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M17 6.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 3 5 3 5 1.1 5 3-2.2 3-5 3-5-1.1-5-3" />
    </svg>
  );
}
