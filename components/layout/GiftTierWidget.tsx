"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { resolveCartLines } from "@/lib/cart-lines";
import { GIFT_TIERS } from "@/lib/discounts";
import { OPEN_SAVINGS_MODAL_EVENT } from "@/components/layout/SavingsModal";
import type { Product } from "@/lib/types";

const sortedTiers = [...GIFT_TIERS].sort((a, b) => a.min - b.min);
const maxTier = sortedTiers[sortedTiers.length - 1];

export function GiftTierWidget({ products }: { products: Product[] }) {
  const { items, count } = useCart();
  const [dismissed, setDismissed] = useState(false);

  const subtotal = resolveCartLines(
    items.filter((i) => !i.isGift),
    products,
  ).reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

  const nextTier = sortedTiers.find((t) => subtotal < t.min);
  const unlockedTier = [...sortedTiers].reverse().find((t) => subtotal >= t.min);
  const pct = Math.min(100, (subtotal / maxTier.min) * 100);

  if (count === 0 || dismissed) return null;

  return (
    <div className="w-[min(320px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-steel-500/40 bg-surface-2/95 shadow-[0_0_30px_-6px_rgba(140,82,199,0.5)] backdrop-blur-md">
      <div className="flex items-start gap-3 p-4">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-steel-400 to-steel-700 text-base">
          🎁
          {unlockedTier && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
              {sortedTiers.indexOf(unlockedTier) + 1}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-fg">
            Free Gift Rewards
          </p>
          <p className="mt-0.5 truncate text-[11px] text-fg-muted">
            {nextTier ? (
              <>
                Spend{" "}
                <span className="font-semibold text-fg">
                  ${(nextTier.min - subtotal).toFixed(2)}
                </span>{" "}
                more for a free {nextTier.label.replace(/^Free /, "")}
              </>
            ) : (
              <span className="font-semibold text-steel-300">
                🎉 {maxTier.label} unlocked!
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 text-fg-faint hover:text-fg"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="px-4">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-steel-500 to-steel-300 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
          {sortedTiers.map((t) => (
            <div
              key={t.min}
              className="absolute top-0 h-1.5 w-px bg-[rgba(3,3,4,0.5)]"
              style={{ left: `${Math.min(100, (t.min / maxTier.min) * 100)}%` }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN_SAVINGS_MODAL_EVENT))}
        className="btn-shimmer mt-3 flex w-full items-center justify-center gap-2 bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:brightness-110"
      >
        View Gift Tiers
      </button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
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
