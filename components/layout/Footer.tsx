import Link from "next/link";
import Image from "next/image";
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
          <Image
            src="/logo.png"
            alt="RUINED"
            width={2400}
            height={1027}
            className="h-9 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            Third-party tested research peptides and compounds. For laboratory
            research use only — not for human consumption.
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <a
              href="mailto:support@ruinedrx.com"
              className="flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <MailIcon />
              support@ruinedrx.com
            </a>
            <a
              href="tel:+12108021229"
              className="flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <PhoneIcon />
              (210) 802-1229
            </a>
            <a
              href="https://maps.google.com/?q=18130+Talavera+Ridge,+San+Antonio,+TX+78257"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <MapPinIcon className="mt-0.5 shrink-0" />
              <span>18130 Talavera Ridge, San Antonio, TX 78257</span>
            </a>
          </div>
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

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M4.5 4h3.5l1.5 5-2.5 1.5a12 12 0 0 0 6.5 6.5l1.5-2.5 5 1.5v3.5a2 2 0 0 1-2.2 2A18 18 0 0 1 2.5 6.2 2 2 0 0 1 4.5 4Z" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
