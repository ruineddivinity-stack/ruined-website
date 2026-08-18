import Link from "next/link";
import { Container } from "@/components/ui/Container";
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
    <header className="sticky top-0 z-40 border-b border-border-soft bg-black/85 backdrop-blur">
      <Container className="relative flex h-20 items-center justify-between py-4">
        <Link
          href="/"
          className="font-display text-2xl font-black tracking-[0.15em] text-gradient-blue"
        >
          RUINED
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

        <div className="flex items-center gap-4">
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
      </Container>
    </header>
  );
}
