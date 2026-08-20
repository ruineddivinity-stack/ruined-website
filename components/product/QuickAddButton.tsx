"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export function QuickAddButton({
  slug,
  disabled,
  hasVariations = false,
}: {
  slug: string;
  disabled?: boolean;
  hasVariations?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (disabled) {
    return (
      <div className="relative z-10 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-danger/40 bg-danger/10 py-3 text-sm font-semibold tracking-wide text-danger">
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.75" />
          <path d="M5.5 5.5l9 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
        Sold Out
      </div>
    );
  }

  if (hasVariations) {
    return (
      <Link
        href={`/product/${slug}`}
        className="relative z-10 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface-2 py-3 text-sm font-semibold tracking-wide text-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-steel-500 hover:bg-surface-3 hover:shadow-[0_0_20px_2px_rgba(31,200,221,0.35)]"
      >
        Choose MG
      </Link>
    );
  }

  return (
    <motion.button
      type="button"
      aria-label="Add to cart"
      whileTap={{ scale: 0.97 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(slug, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className="btn-shimmer relative z-10 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface-2 py-3 text-sm font-semibold tracking-wide text-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-steel-500 hover:bg-surface-3 hover:shadow-[0_0_20px_2px_rgba(31,200,221,0.35)]"
    >
      {added ? (
        <>
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-steel-300">
            <path
              d="M4 10.5l3.5 3.5L16 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Added
        </>
      ) : (
        <>
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          Add to cart
        </>
      )}
    </motion.button>
  );
}
