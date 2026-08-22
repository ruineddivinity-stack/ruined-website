"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { resolveCartLines } from "@/lib/cart-lines";
import { GIFT_TIERS } from "@/lib/discounts";
import type { Product } from "@/lib/types";

export const OPEN_GIFT_TIERS_MODAL_EVENT = "ruined:open-gift-tiers-modal";

const sortedTiers = [...GIFT_TIERS].sort((a, b) => a.min - b.min);
const maxTier = sortedTiers[sortedTiers.length - 1];

export function GiftTiersModal({ products }: { products: Product[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const close = () => setIsOpen(false);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_GIFT_TIERS_MODAL_EVENT, open);
    return () => window.removeEventListener(OPEN_GIFT_TIERS_MODAL_EVENT, open);
  }, []);

  // Bundle-picked vials don't count here — a bundle is its own self-contained
  // deal (25% off + a free BAC Water already included), separate from this
  // regular-item reward ladder.
  const subtotal = resolveCartLines(
    items.filter((i) => !i.isGift && !i.isBundlePick),
    products,
  ).reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const pct = Math.min(100, (subtotal / maxTier.min) * 100);
  const nextTier = sortedTiers.find((t) => subtotal < t.min);
  const hasBundle = items.some((i) => i.isBundlePick);

  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-50 bg-[rgba(3,3,4,0.75)] backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-label="Gift tiers"
        className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 overflow-hidden rounded-3xl border border-steel-500/30 bg-surface-2 shadow-[0_0_60px_-10px_rgba(140,82,199,0.35)] transition-all duration-300 ${
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
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-steel-400 to-steel-700 text-2xl">
              🎁
            </span>
          </div>

          <h2 className="mt-4 text-center font-display text-2xl font-black uppercase tracking-tight text-gradient-holo sm:text-3xl">
            Free Gift Rewards
          </h2>
          <p className="mt-2 text-center text-xs uppercase tracking-widest text-fg-muted">
            The more you spend, the more you get &mdash; automatically
          </p>
          {hasBundle && (
            <p className="mt-2 text-center text-[11px] leading-relaxed text-fg-faint">
              Based on your regular items only — your bundle already
              includes its own free BAC Water and doesn&rsquo;t count here.
            </p>
          )}

          <div className="mt-6">
            <p className="text-xs font-medium text-fg-muted">
              {nextTier ? (
                <>
                  You&rsquo;re{" "}
                  <span className="font-semibold text-fg">
                    ${(nextTier.min - subtotal).toFixed(2)}
                  </span>{" "}
                  away from {nextTier.label}
                </>
              ) : (
                <span className="font-semibold text-steel-300">
                  🎉 Every gift tier is unlocked!
                </span>
              )}
            </p>
            <div className="relative mt-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-steel-500 to-steel-300 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {sortedTiers.map((t) => (
                <div
                  key={t.min}
                  className="absolute top-0 h-2 w-px bg-[rgba(3,3,4,0.5)]"
                  style={{ left: `${Math.min(100, (t.min / maxTier.min) * 100)}%` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {sortedTiers.map((tier) => {
              const unlocked = subtotal >= tier.min;
              return (
                <div
                  key={tier.min}
                  className={`flex items-center gap-3 rounded-2xl border p-4 transition-colors ${
                    unlocked
                      ? "border-emerald-400/50 bg-emerald-500/10"
                      : "border-border bg-surface/60"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${
                      unlocked
                        ? "bg-emerald-500/25 text-emerald-300"
                        : "bg-surface-3 text-fg-faint"
                    }`}
                  >
                    {unlocked ? <CheckIcon /> : <LockIcon />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-fg">
                      Spend ${tier.min}+
                    </p>
                    <p className="text-xs text-fg-muted">{tier.label}</p>
                  </div>
                  {unlocked && (
                    <span className="shrink-0 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                      In Cart
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <Link
            href="/shop"
            onClick={close}
            className="btn-shimmer mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_0_1px_rgba(241,242,247,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_4px_rgba(203,206,218,0.45)]"
          >
            Keep Shopping &mdash; Unlock More
          </Link>
        </div>
      </div>
    </>
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

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
