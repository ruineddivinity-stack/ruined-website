"use client";

import { useCart } from "@/lib/cart-context";
import { CartIcon } from "@/components/layout/CartButton";

export function FloatingCartButton() {
  const { openCart, count } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Open cart"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-steel-500/40 bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 text-black shadow-lg shadow-black/50 transition-transform hover:scale-105"
    >
      <CartIcon />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-steel-600 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
