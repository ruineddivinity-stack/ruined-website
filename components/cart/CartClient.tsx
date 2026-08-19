"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";
import { FreeShippingProgress } from "@/components/cart/FreeShippingProgress";
import { SpendDiscountProgress } from "@/components/cart/SpendDiscountProgress";
import { SavingsBadgeRow } from "@/components/cart/SavingsBadgeRow";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import { calculateDiscounts } from "@/lib/discounts";

export function CartClient({ products }: { products: Product[] }) {
  const { items, updateQty, removeItem } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.slug === item.slug);
      return product ? { product, qty: item.qty } : null;
    })
    .filter((line): line is { product: Product; qty: number } => line !== null);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const discounts = calculateDiscounts(
    lines.map((l) => ({
      subtotal: l.product.price * l.qty,
      qty: l.qty,
      isBundle: l.product.type === "bundle",
    })),
    promoCode,
  );

  if (lines.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-5 rounded-3xl border border-border bg-surface/60 px-8 py-16 text-center">
        <p className="text-sm text-fg-muted">Your cart is empty.</p>
        <Button href="/shop">Shop the Catalog</Button>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        {lines.map(({ product, qty }) => (
          <div
            key={product.slug}
            className="flex items-center gap-5 rounded-2xl border border-border bg-surface/60 p-5"
          >
            {product.image ? (
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#eef1f3]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-1.5"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg border border-chrome-500/30 bg-gradient-to-b from-surface-3 to-surface">
                <span className="font-display text-[8px] font-semibold tracking-widest text-gradient-holo">
                  RUINED
                </span>
              </div>
            )}

            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-faint">
                {product.category}
              </p>
              <Link
                href={`/product/${product.slug}`}
                className="text-sm font-semibold text-fg hover:text-steel-300"
              >
                {product.name}
              </Link>
              {product.size && (
                <p className="mt-1 text-xs text-fg-faint">{product.size}</p>
              )}
            </div>

            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                onClick={() => updateQty(product.slug, qty - 1)}
                className="flex h-9 w-9 items-center justify-center text-fg-muted hover:text-fg"
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <span className="w-6 text-center text-sm font-semibold text-fg">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => updateQty(product.slug, qty + 1)}
                className="flex h-9 w-9 items-center justify-center text-fg-muted hover:text-fg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <p className="w-16 text-right text-sm font-semibold text-fg">
              ${(product.price * qty).toFixed(2)}
            </p>

            <button
              type="button"
              onClick={() => removeItem(product.slug)}
              aria-label="Remove item"
              className="text-fg-faint hover:text-danger"
            >
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-2xl border border-border bg-surface/60 p-6">
        <h2 className="font-display text-lg font-black uppercase tracking-wide text-fg">
          Order Summary
        </h2>

        <div className="mt-5 flex flex-col gap-4">
          <FreeShippingProgress subtotal={subtotal} />
          <SpendDiscountProgress subtotal={subtotal} />
        </div>

        <div className="mt-5">
          <SavingsBadgeRow />
        </div>

        <div className="mt-5">
          <PromoCodeInput
            applied={discounts.affiliateApplied}
            onApply={setPromoCode}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-border-soft pt-5 text-sm">
          <div className="flex justify-between text-fg-muted">
            <span>Subtotal</span>
            <span className="text-fg">${subtotal.toFixed(2)}</span>
          </div>
          {discounts.bulkTier && (
            <div className="flex justify-between text-steel-300">
              <span>{discounts.bulkTier.label} discount</span>
              <span>-${discounts.bulkAmount.toFixed(2)}</span>
            </div>
          )}
          {discounts.spendTier && (
            <div className="flex justify-between text-steel-300">
              <span>Spend ${discounts.spendTier.min}+ reward</span>
              <span>-${discounts.spendAmount.toFixed(2)}</span>
            </div>
          )}
          {discounts.affiliateApplied && (
            <div className="flex justify-between text-steel-300">
              <span>Affiliate code (10%)</span>
              <span>-${discounts.affiliateAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-fg-muted">
            <span>Shipping</span>
            <span className="text-fg">
              {discounts.freeShipping ? "Free" : "Calculated at checkout"}
            </span>
          </div>
        </div>

        <div className="mt-5 flex justify-between border-t border-border-soft pt-5 text-base font-semibold text-fg">
          <span>Total</span>
          <span>${discounts.total.toFixed(2)}</span>
        </div>

        <Button href="/checkout" className="mt-6 w-full justify-center">
          Checkout
        </Button>
        <Link
          href="/shop"
          className="mt-4 block text-center text-xs text-fg-muted hover:text-fg"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
