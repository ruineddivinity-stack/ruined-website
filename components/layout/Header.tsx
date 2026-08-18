import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CartButton } from "@/components/layout/CartButton";
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
    <header className="sticky top-3 z-40 px-4 sm:top-4">
      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full border border-steel-500/25 bg-surface/70 px-4 shadow-[0_0_30px_-6px_rgba(140,82,199,0.4)] backdrop-blur-xl sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="RUINED"
            width={2400}
            height={1027}
            priority
            className="h-8 w-auto sm:h-10"
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
          <Button
            href="/shop"
            variant="secondary"
            className="!hidden whitespace-nowrap uppercase tracking-wide md:!inline-flex"
          >
            Shop Now
          </Button>
          <AccountButton href={session ? "/account" : "/login"} />
          <CartButton />
          <MobileNav accountHref={session ? "/account" : "/login"} />
        </div>
      </div>
    </header>
  );
}
