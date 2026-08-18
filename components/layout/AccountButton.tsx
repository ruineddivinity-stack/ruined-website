import Link from "next/link";

export function AccountButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Account"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:border-steel-500 hover:text-fg"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
      </svg>
    </Link>
  );
}
