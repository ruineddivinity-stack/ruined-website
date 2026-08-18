"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { AFFILIATE_CODE, AFFILIATE_RATE } from "@/lib/discounts";

const overlayVariants = { closed: { opacity: 0 }, open: { opacity: 1 } };
const panelVariants = { closed: { x: "100%" }, open: { x: "0%" } };

type NavLink = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/shop", label: "Shop", icon: ShopIcon },
  { href: "/coa", label: "COAs", icon: ShieldIcon },
  { href: "/about", label: "About", icon: InfoIcon },
  { href: "/contact", label: "Contact", icon: MailIcon },
];

export function MobileNav({ accountHref }: { accountHref: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawer = (
    <>
      <motion.div
        onClick={() => setOpen(false)}
        aria-hidden
        className="fixed inset-0 z-[60] bg-black/60"
        style={{ pointerEvents: open ? "auto" : "none" }}
        variants={overlayVariants}
        animate={open ? "open" : "closed"}
        initial="closed"
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      <motion.div
        role="dialog"
        aria-label="Menu"
        className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-xs flex-col border-l border-border bg-surface"
        variants={panelVariants}
        animate={open ? "open" : "closed"}
        initial="closed"
        transition={{ type: "spring", stiffness: 340, damping: 34, mass: 1 }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[2px]"
          style={{
            background:
              "linear-gradient(180deg, var(--color-holo-violet), var(--color-holo-blue), var(--color-holo-pink), var(--color-holo-gold))",
          }}
          animate={open ? { opacity: [0, 1, 0.6] } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        />
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-5">
          <Image
            src="/logo.png"
            alt="RUINED"
            width={2400}
            height={1027}
            className="h-7 w-auto"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:border-steel-500 hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-3 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <link.icon className="h-5 w-5 shrink-0 text-fg-faint transition-colors group-hover:text-steel-400" />
              <span className="flex-1">{link.label}</span>
              <ChevronIcon className="h-4 w-4 shrink-0 text-fg-faint transition-transform group-hover:translate-x-0.5 group-hover:text-fg-muted" />
            </Link>
          ))}
        </nav>

        <div className="mx-6 border-t border-border-soft" />

        <div className="flex flex-col px-3 py-3">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openCart();
            }}
            className="group flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <CartIcon className="h-5 w-5 shrink-0 text-fg-faint transition-colors group-hover:text-steel-400" />
            <span className="flex-1 text-left">Cart</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-steel-500 px-1.5 text-[11px] font-bold text-black">
                {count}
              </span>
            )}
          </button>

          <Link
            href={accountHref}
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <UserIcon className="h-5 w-5 shrink-0 text-fg-faint transition-colors group-hover:text-steel-400" />
            <span className="flex-1">My Account</span>
            <ChevronIcon className="h-4 w-4 shrink-0 text-fg-faint transition-transform group-hover:translate-x-0.5 group-hover:text-fg-muted" />
          </Link>
        </div>

        <div className="mt-auto p-4">
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-2xl border border-steel-600/50 bg-steel-700/15 px-4 py-3.5 transition-colors hover:border-steel-500 hover:bg-steel-700/25"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-steel-600/40 text-steel-300">
              <TagIcon className="h-4 w-4" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-fg">
                Affiliate Code &ldquo;{AFFILIATE_CODE}&rdquo;
              </span>
              <span className="block text-xs text-steel-300">
                Get {AFFILIATE_RATE * 100}% off your order
              </span>
            </span>
          </Link>
        </div>
      </motion.div>
    </>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 text-fg-muted transition-colors hover:border-steel-500 hover:text-fg"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {mounted && createPortal(drawer, document.body)}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShopIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M9 3h6l1 4H8l1-4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12h4" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M20 12.5 12.5 20a1.5 1.5 0 0 1-2.1 0L4 13.6a1.5 1.5 0 0 1 0-2.1L11.5 4H18a2 2 0 0 1 2 2v6.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15.5" cy="8.5" r="1.25" />
    </svg>
  );
}
