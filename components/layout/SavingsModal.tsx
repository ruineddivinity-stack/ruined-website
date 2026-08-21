"use client";

import { useState, useEffect, type ReactNode, type ComponentType } from "react";
import Link from "next/link";
import {
  BULK_TIERS,
  SPEND_TIERS,
  GIFT_TIERS,
  AFFILIATE_CODE,
  STACKED_SAVINGS_PCT,
} from "@/lib/discounts";

export const OPEN_SAVINGS_MODAL_EVENT = "ruined:open-savings-modal";

export function SavingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_SAVINGS_MODAL_EVENT, open);
    return () => window.removeEventListener(OPEN_SAVINGS_MODAL_EVENT, open);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-full border border-steel-500/40 bg-surface-2/95 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg shadow-[0_0_20px_2px_rgba(31,200,221,0.3)] backdrop-blur transition-transform hover:scale-105"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-steel-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-steel-400" />
        </span>
        <TagIcon />
        <span className="hidden sm:inline">How to Save $</span>
      </button>

      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-50 bg-[rgba(3,3,4,0.75)] backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-label="How to save"
        className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-3xl border border-steel-500/30 bg-surface-2 shadow-[0_0_60px_-10px_rgba(31,200,221,0.35)] transition-all duration-300 ${
          isOpen
            ? "-translate-y-1/2 opacity-100"
            : "pointer-events-none -translate-y-[45%] opacity-0"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-40 blur-[80px]"
          style={{
            background:
              "conic-gradient(from 180deg, var(--color-holo-violet), var(--color-holo-blue), var(--color-holo-pink), var(--color-holo-gold), var(--color-holo-violet))",
          }}
        />

        <div className="relative max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 text-fg-muted hover:text-fg"
          >
            <CloseIcon />
          </button>

          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-steel-500/40 bg-steel-700/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-steel-300">
              <span className="h-1.5 w-1.5 rounded-full bg-steel-400" />
              RUINED SAVINGS
            </span>
          </div>

          <h2 className="mt-5 text-center font-display text-3xl font-black uppercase tracking-tight text-gradient-holo sm:text-4xl">
            Save Up to {STACKED_SAVINGS_PCT.kit}%
          </h2>
          <p className="mt-2 text-center text-xs uppercase tracking-widest text-fg-muted">
            Stack these on every order
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2.5">
            <StatChip value={`${STACKED_SAVINGS_PCT.bulk}%`} label="3+ Vials" />
            <StatChip value={`${STACKED_SAVINGS_PCT.kit}%`} label="Full Kit" />
            <StatChip value="10%" label="Any Order" />
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <Section number={1} title="Buying Bulk">
              <Row icon={ThreeVialsIcon}>
                <span className="font-semibold text-fg">
                  {BULK_TIERS.bulk.label}
                </span>
                <StackedSavings
                  basePct={BULK_TIERS.bulk.rate * 100}
                  stackedPct={STACKED_SAVINGS_PCT.bulk}
                />
              </Row>
              <Row icon={BoxIcon}>
                <span className="font-semibold text-fg">
                  {BULK_TIERS.kit.label}
                </span>
                <StackedSavings
                  basePct={BULK_TIERS.kit.rate * 100}
                  stackedPct={STACKED_SAVINGS_PCT.kit}
                />
              </Row>
            </Section>

            <Section number={2} title="Spend More, Save More">
              <Row icon={CartIcon}>
                <span className="font-semibold text-fg">
                  The more you buy, the more you save
                </span>
              </Row>
              <p className="mt-1 text-xs text-fg-muted">
                Volume discounts are automatically applied at checkout.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[...SPEND_TIERS].reverse().map((tier) => (
                  <div
                    key={tier.min}
                    className="rounded-xl border border-steel-600/50 bg-steel-700/15 px-3 py-3 text-center transition-colors hover:border-steel-500"
                  >
                    <p className="text-sm font-bold text-fg">
                      Spend ${tier.min}
                    </p>
                    <p className="text-xs font-semibold text-steel-300">
                      Get ${tier.amount} off
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section number={3} title="Free Gifts">
              <Row icon={GiftIcon}>
                <span className="font-semibold text-fg">
                  Unlock a free item as your cart grows
                </span>
              </Row>
              <p className="mt-1 text-xs text-fg-muted">
                Automatically added at checkout &mdash; no code needed.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {[...GIFT_TIERS].reverse().map((tier) => (
                  <div
                    key={tier.min}
                    className="flex items-center justify-between rounded-xl border border-steel-600/50 bg-steel-700/15 px-3 py-2.5 transition-colors hover:border-steel-500"
                  >
                    <span className="text-sm font-bold text-fg">
                      Spend ${tier.min}+
                    </span>
                    <span className="text-right text-xs font-semibold text-steel-300">
                      {tier.label}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            <Section number={4} title="Affiliate Codes">
              <Row icon={GiftIcon}>
                <span className="font-semibold text-fg">
                  Get an extra 10% off your order
                </span>
              </Row>
              <p className="mt-1 text-xs text-fg-muted">
                Codes stack with bulk discounts and kits.
              </p>
              <ul className="mt-3 flex flex-col gap-1.5 text-xs text-fg-muted">
                <li>&bull; New here? Join the list for your 10% off code</li>
                <li>&bull; Or use an affiliate code from our community</li>
              </ul>
            </Section>

            <Section number={5} title="Refer a Friend">
              <Row icon={GiftIcon}>
                <span className="font-semibold text-fg">
                  Give 10% off, get $10 store credit
                </span>
              </Row>
              <p className="mt-1 text-xs text-fg-muted">
                Every account gets a personal referral link &mdash; when a
                friend orders with it, they save 10% and $10 in store credit
                lands in your account automatically.
              </p>
              <Link
                href="/account/referrals"
                onClick={close}
                className="mt-2 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-steel-300 hover:text-steel-200"
              >
                Get your referral link &rarr;
              </Link>
            </Section>
          </div>

          <Link
            href="/shop"
            onClick={close}
            className="btn-shimmer mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_0_1px_rgba(241,242,247,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_4px_rgba(203,206,218,0.45)]"
          >
            Start Saving &mdash; Shop the Catalog
          </Link>
        </div>
      </div>
    </>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-steel-600/40 bg-gradient-to-b from-steel-700/25 to-steel-700/5 py-3 text-center">
      <p className="font-display text-lg font-black text-gradient-holo">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-fg-faint">
        {label}
      </p>
    </div>
  );
}

function StackedSavings({
  basePct,
  stackedPct,
}: {
  basePct: number;
  stackedPct: number;
}) {
  return (
    <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs">
      <span className="font-bold text-steel-300">Save {basePct}%</span>
      <span className="text-fg-faint">or up to</span>
      <span className="font-bold text-gradient-holo">{stackedPct}%</span>
      <span className="text-fg-faint">with code {AFFILIATE_CODE}</span>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-5 transition-colors duration-300 hover:border-steel-500/40">
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-steel-400 to-steel-700 text-[11px] font-bold text-white">
          {number}
        </span>
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-fg-faint">
          {title}
        </h3>
      </div>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-steel-700/50 to-steel-700/10 text-steel-300">
        <Icon />
      </span>
      <span>{children}</span>
    </div>
  );
}

function iconProps(className?: string) {
  return {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12.6 3H5a2 2 0 0 0-2 2v7.6a2 2 0 0 0 .59 1.41l8.4 8.4a2 2 0 0 0 2.82 0l7.6-7.6a2 2 0 0 0 0-2.82l-8.4-8.4A2 2 0 0 0 12.6 3Z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M4 13h16M12 9v11" />
      <path d="M12 9c-1.8 0-3.2-1.2-3.2-2.8S9.2 3.5 10.5 3.5c1.6 0 2.5 2.2 2.5 2.2" />
      <path d="M12 9c1.8 0 3.2-1.2 3.2-2.8S13.8 3.5 12.5 3.5c-1.6 0-2.5 2.2-2.5 2.2" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5Z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </svg>
  );
}

function ThreeVialsIcon({ className }: { className?: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="1.25" y="8" width="4.5" height="3" rx="0.8" />
      <rect x="0.75" y="10.5" width="5.5" height="11" rx="1.8" />
      <rect x="9.75" y="4" width="4.5" height="3" rx="0.8" />
      <rect x="9.25" y="6.5" width="5.5" height="15" rx="1.8" />
      <rect x="18.25" y="8" width="4.5" height="3" rx="0.8" />
      <rect x="17.75" y="10.5" width="5.5" height="11" rx="1.8" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
