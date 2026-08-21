"use client";

import { useCart } from "@/lib/cart-context";
import { CartIcon } from "@/components/layout/CartButton";
import { resolveCartLines } from "@/lib/cart-lines";
import { GIFT_TIERS, getGiftTier } from "@/lib/discounts";
import type { Product } from "@/lib/types";

const sortedTiers = [...GIFT_TIERS].sort((a, b) => a.min - b.min);
const maxTier = sortedTiers[sortedTiers.length - 1];

export function FloatingCartButton({ products }: { products: Product[] }) {
  const { openCart, count, items } = useCart();

  const subtotal = resolveCartLines(items, products).reduce(
    (sum, l) => sum + l.unitPrice * l.qty,
    0,
  );
  const unlockedTier = getGiftTier(subtotal);
  const nextTier = sortedTiers.find((t) => subtotal < t.min);

  const giftMessage =
    count === 0
      ? null
      : unlockedTier && unlockedTier.min === maxTier.min
        ? `${maxTier.label} unlocked!`
        : nextTier
          ? `$${(nextTier.min - subtotal).toFixed(2)} to ${nextTier.label}`
          : null;

  return (
    <>
      {giftMessage && (
        <span className="hidden max-w-[220px] items-center gap-1.5 rounded-full border border-steel-500/40 bg-surface-2/95 px-3 py-2 text-[11px] font-semibold text-fg shadow-lg backdrop-blur sm:flex">
          🎁 {giftMessage}
        </span>
      )}
      <button
        type="button"
        onClick={openCart}
        aria-label="Open cart"
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-steel-500/40 bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 text-black shadow-lg shadow-black/50 transition-transform hover:scale-105"
      >
        <CartIcon />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-steel-600 px-1 text-[11px] font-bold text-white">
            {count}
          </span>
        )}
      </button>
    </>
  );
}
