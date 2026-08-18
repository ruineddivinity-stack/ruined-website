"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";
import { BULK_TIERS } from "@/lib/discounts";

export function AddToCart({
  slug,
  disabled = false,
  showBulkOptions = false,
}: {
  slug: string;
  disabled?: boolean;
  showBulkOptions?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  if (disabled) {
    return (
      <Button type="button" className="opacity-50" disabled>
        Out of Stock
      </Button>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-fg-muted hover:text-fg"
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span className="w-8 text-center text-sm font-semibold text-fg">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center text-fg-muted hover:text-fg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <Button
          type="button"
          className="flex-1 sm:flex-none"
          onClick={() => addItem(slug, qty)}
        >
          Add to Cart
        </Button>
      </div>

      {showBulkOptions && (
        <div className="mt-4 flex flex-wrap gap-3">
          <BulkAddButton
            label={`${BULK_TIERS.bulk.min} Vials`}
            sub={`Save ${BULK_TIERS.bulk.rate * 100}%`}
            onClick={() => addItem(slug, BULK_TIERS.bulk.min)}
          />
          <BulkAddButton
            label={`Kit (${BULK_TIERS.kit.min})`}
            sub={`Save ${BULK_TIERS.kit.rate * 100}%`}
            onClick={() => addItem(slug, BULK_TIERS.kit.min)}
          />
        </div>
      )}
    </div>
  );
}

function BulkAddButton({
  label,
  sub,
  onClick,
}: {
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-steel-600/50 bg-steel-700/15 px-4 py-2.5 text-left transition-colors hover:border-steel-500 hover:bg-steel-700/25"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-steel-400" />
      <span>
        <span className="block text-xs font-semibold text-fg">
          + Add {label}
        </span>
        <span className="block text-[11px] text-steel-300">{sub}</span>
      </span>
    </button>
  );
}
