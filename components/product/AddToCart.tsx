"use client";

import { useState, type ComponentType } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";
import { AFFILIATE_CODE, BULK_TIERS } from "@/lib/discounts";

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
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <BulkAddButton
            icon={LayersIcon}
            label={`${BULK_TIERS.bulk.min} Vials`}
            baseRate={BULK_TIERS.bulk.rate}
            stackedPct={18}
            onClick={() => addItem(slug, BULK_TIERS.bulk.min)}
          />
          <BulkAddButton
            icon={BoxIcon}
            label={`Kit (${BULK_TIERS.kit.min})`}
            baseRate={BULK_TIERS.kit.rate}
            stackedPct={30}
            onClick={() => addItem(slug, BULK_TIERS.kit.min)}
          />
        </div>
      )}
    </div>
  );
}

function BulkAddButton({
  icon: Icon,
  label,
  baseRate,
  stackedPct,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  baseRate: number;
  stackedPct: number;
  onClick: () => void;
}) {
  const basePct = Math.round(baseRate * 100);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl border border-steel-600/40 bg-gradient-to-b from-steel-700/20 to-steel-700/5 px-4 py-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-steel-500 hover:shadow-[0_0_20px_2px_rgba(31,200,221,0.25)]"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-steel-600/25 text-steel-300 transition-transform duration-300 group-hover:scale-110">
        <span
          aria-hidden
          className="absolute inset-0 rounded-xl bg-steel-500/20 blur-md"
        />
        <Icon className="relative" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-wide text-fg">
          + Add {label}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] leading-tight">
          <span className="font-bold text-steel-300">Save {basePct}%</span>
          <span className="text-fg-faint">or up to</span>
          <span className="font-bold text-gradient-holo">{stackedPct}%</span>
          <span className="text-fg-faint">with code {AFFILIATE_CODE}</span>
        </span>
      </span>
    </button>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21 8-9-5-9 5v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </svg>
  );
}
