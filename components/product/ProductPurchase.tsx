"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const requestedMg = searchParams.get("mg");

  const [selected, setSelected] = useState<ProductVariation | null>(() => {
    if (!variations) return null;
    const requested = requestedMg
      ? variations.find(
          (v) => v.label.toLowerCase() === requestedMg.toLowerCase(),
        )
      : null;
    return requested ?? variations.find((v) => v.inStock) ?? variations[0] ?? null;
  });

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
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">
            Select MG
          </p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {variations.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.inStock}
                onClick={() => setSelected(v)}
                className={`rounded-full border-2 px-5 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                  selected?.id === v.id
                    ? "scale-105 border-steel-400 bg-steel-600/30 text-white shadow-[0_0_16px_2px_rgba(31,200,221,0.5)]"
                    : v.inStock
                      ? "border-border text-fg-muted hover:-translate-y-0.5 hover:border-steel-500/70 hover:text-fg"
                      : "cursor-not-allowed border-border text-fg-faint opacity-40"
                }`}
              >
                {v.label}
                {!v.inStock && " — Sold Out"}
              </button>
            ))}
          </div>
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
