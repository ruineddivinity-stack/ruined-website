"use client";

import { useCart } from "@/lib/cart-context";
import { resolveCartLines } from "@/lib/cart-lines";
import { GIFT_TIERS } from "@/lib/discounts";
import { OPEN_GIFT_TIERS_MODAL_EVENT } from "@/components/layout/GiftTiersModal";
import type { Product } from "@/lib/types";

const sortedTiers = [...GIFT_TIERS].sort((a, b) => a.min - b.min);

export function GiftTierWidget({ products }: { products: Product[] }) {
  const { items, count } = useCart();

  const subtotal = resolveCartLines(
    items.filter((i) => !i.isGift),
    products,
  ).reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

  const unlockedTier = [...sortedTiers].reverse().find((t) => subtotal >= t.min);

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_GIFT_TIERS_MODAL_EVENT))}
      className="flex items-center gap-2 rounded-full border border-steel-500/40 bg-surface-2/95 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg shadow-[0_0_20px_2px_rgba(140,82,199,0.35)] backdrop-blur transition-transform hover:scale-105"
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-steel-400 to-steel-700 text-[10px]">
        🎁
        {unlockedTier && (
          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
            {sortedTiers.indexOf(unlockedTier) + 1}
          </span>
        )}
      </span>
      Free Gift Rewards
    </button>
  );
}
