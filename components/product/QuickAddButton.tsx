"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function QuickAddButton({
  slug,
  disabled,
}: {
  slug: string;
  disabled?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (disabled) return null;

  return (
    <button
      type="button"
      aria-label="Quick add to cart"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(slug, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/90 text-fg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-steel-500 hover:bg-surface-2 hover:shadow-[0_0_18px_2px_rgba(86,134,172,0.4)]"
    >
      {added ? (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-steel-300">
          <path
            d="M4 10.5l3.5 3.5L16 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <path
            d="M4 6h1.2l1.6 8.4a1 1 0 0 0 1 .8h6.4a1 1 0 0 0 1-.78L16.5 8H6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 4v5.5M7.25 6.75h5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
