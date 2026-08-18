"use client";

import { useState } from "react";
import { BULK_TIERS, SPEND_TIERS, AFFILIATE_CODE } from "@/lib/discounts";

export function SavingsModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full border border-steel-500/40 bg-surface-2/95 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg shadow-lg shadow-black/50 backdrop-blur transition-transform hover:scale-105"
      >
        <TagIcon />
        How to Save $
      </button>

      <div
        onClick={() => setIsOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-label="How to save"
        className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-3xl border border-border bg-surface-2 shadow-2xl transition-all duration-300 ${
          isOpen
            ? "-translate-y-1/2 opacity-100"
            : "pointer-events-none -translate-y-[45%] opacity-0"
        }`}
      >
        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="absolute right-5 top-5 text-fg-muted hover:text-fg"
          >
            <CloseIcon />
          </button>

          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-steel-500/40 bg-steel-700/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-steel-300">
              <span className="h-1.5 w-1.5 rounded-full bg-steel-400" />
              RUINED
            </span>
          </div>

          <h2 className="mt-5 text-center font-display text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
            How to save on your purchase
          </h2>
          <p className="mt-2 text-center text-xs uppercase tracking-widest text-fg-muted">
            Get the most out of every order
          </p>

          <div className="mt-8 flex flex-col gap-5">
            <Section number={1} title="Buying Bulk">
              <Row icon={GiftIcon}>
                <span className="font-semibold text-fg">
                  {BULK_TIERS.bulk.label}
                </span>{" "}
                <span className="text-steel-300">
                  {BULK_TIERS.bulk.rate * 100}% off
                </span>
              </Row>
              <Row icon={BoxIcon}>
                <span className="font-semibold text-fg">
                  {BULK_TIERS.kit.label}
                </span>{" "}
                <span className="text-steel-300">
                  {BULK_TIERS.kit.rate * 100}% off
                </span>
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
                    className="rounded-xl border border-steel-600/50 bg-steel-700/15 px-3 py-3 text-center"
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
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-fg-faint">
                Affiliate codes also work with bulk discounts and kits.
              </p>
            </Section>

            <Section number={3} title="Affiliate Codes">
              <Row icon={GiftIcon}>
                <span className="font-semibold text-fg">
                  Get an extra 10% off your order
                </span>
              </Row>
              <p className="mt-1 text-xs text-fg-muted">
                Affiliate codes also work with bulk discounts and kits.
              </p>
              <ul className="mt-3 flex flex-col gap-1.5 text-xs text-fg-muted">
                <li>
                  &bull; Use code &ldquo;
                  <span className="font-semibold text-fg">
                    {AFFILIATE_CODE}
                  </span>
                  &rdquo; at checkout for 10% off
                </li>
                <li>&bull; Or use an affiliate code from our community</li>
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-5">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-fg-faint">
        {number}. {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  children,
}: {
  icon: (props: { className?: string }) => React.ReactElement;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-steel-700/50 to-steel-700/10 text-steel-300">
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
