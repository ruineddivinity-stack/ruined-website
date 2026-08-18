import Link from "next/link";
import { Container } from "@/components/ui/Container";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/coa", label: "COAs" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/research-only", label: "Research Use Only" },
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/shipping", label: "Shipping Policy" },
      { href: "/legal/refunds", label: "Refund Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-surface/70">
      <Container className="grid grid-cols-2 gap-10 py-16 md:grid-cols-5">
        <div className="col-span-2">
          <span className="font-display text-2xl font-black tracking-[0.15em] text-gradient-blue">
            RUINED
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            Third-party tested research peptides and compounds. For laboratory
            research use only — not for human consumption.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-muted">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-border-soft py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-fg-faint sm:flex-row">
          <p>&copy; {new Date().getFullYear()} RUINED. All rights reserved.</p>
          <p>Research use only. Not for human or veterinary use.</p>
        </Container>
      </div>
    </footer>
  );
}
