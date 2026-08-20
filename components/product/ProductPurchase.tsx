"use client";

import { useState } from "react";
import { AddToCart } from "@/components/product/AddToCart";
import { FulfillmentTimer } from "@/components/product/FulfillmentTimer";
import type { ProductVariation } from "@/lib/types";

export function ProductPurchase({
  slug,
  price,
  regularPrice,
  onSale,
  inStock,
  variations,
  showBulkOptions,
}: {
  slug: string;
  price: number;
  regularPrice: number;
  onSale: boolean;
  inStock: boolean;
  variations: ProductVariation[] | null;
  showBulkOptions: boolean;
}) {
  const [selected, setSelected] = useState<ProductVariation | null>(
    variations ? (variations.find((v) => v.inStock) ?? variations[0] ?? null) : null,
  );

  const activePrice = selected ? selected.price : price;
  const activeRegularPrice = selected ? selected.regularPrice : regularPrice;
  const activeOnSale = selected ? selected.onSale : onSale;
  const activeInStock = selected ? selected.inStock : inStock;

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-black text-fg">
          ${activePrice.toFixed(2)}
        </span>
        {activeOnSale && (
          <span className="text-lg text-fg-faint line-through">
            ${activeRegularPrice.toFixed(2)}
          </span>
        )}
      </div>

      {variations && variations.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {variations.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={!v.inStock}
              onClick={() => setSelected(v)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                selected?.id === v.id
                  ? "border-steel-500 bg-steel-700/15 text-fg"
                  : v.inStock
                    ? "border-border text-fg-muted hover:border-steel-500/50"
                    : "cursor-not-allowed border-border text-fg-faint opacity-50"
              }`}
            >
              {v.label}
              {!v.inStock && " — Sold Out"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <FulfillmentTimer />
      </div>

      <div className="mt-8">
        <AddToCart
          slug={slug}
          disabled={!activeInStock}
          showBulkOptions={showBulkOptions}
          variationId={selected?.id}
          variationLabel={selected?.label}
        />
      </div>
    </div>
  );
}
