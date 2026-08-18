"use client";

import { useCart } from "@/lib/cart-context";

export function CartButton() {
  const { openCart, count } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Open cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:border-steel-500 hover:text-fg"
    >
      <CartIcon />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-steel-500 px-1 text-[10px] font-bold text-black">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6 5 3H2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
    </svg>
  );
}
