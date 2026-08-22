"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";
import { FreeShippingProgress } from "@/components/cart/FreeShippingProgress";
import { SpendDiscountProgress } from "@/components/cart/SpendDiscountProgress";
import { GiftProgress } from "@/components/cart/GiftProgress";
import { SavingsBadgeRow } from "@/components/cart/SavingsBadgeRow";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import { calculateDiscounts, BULK_TIERS, BUNDLE_DISCOUNT_RATE } from "@/lib/discounts";
import { resolveCartLines, type CartLine } from "@/lib/cart-lines";

export function CartClient({ products }: { products: Product[] }) {
  const { items, updateQty, removeItem, removeBundle, coupon, setCoupon } = useCart();

  const lines = resolveCartLines(items, products);

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  // Bundle-picked vials already earn their own free item — exclude them so
  // the tier-gift progress bar doesn't imply a second one is coming.
  const giftSubtotal = lines
    .filter((l) => !l.isBundlePick)
    .reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const discounts = calculateDiscounts(
    lines.map((l) => ({
      subtotal: l.unitPrice * l.qty,
      qty: l.qty,
      isBundle: l.product.type === "bundle",
      isGift: l.isGift,
      isBundlePick: l.isBundlePick,
    })),
    coupon,
  );

  if (lines.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-5 rounded-3xl border border-border bg-surface/60 px-8 py-16 text-center">
        <p className="text-sm text-fg-muted">Your cart is empty.</p>
        <Button href="/shop">Shop the Catalog</Button>
      </div>
    );
  }

  const bundleGroups = new Map<string, CartLine[]>();
  const soloLines: CartLine[] = [];
  for (const line of lines) {
    if (line.bundleId) {
      const group = bundleGroups.get(line.bundleId) ?? [];
      group.push(line);
      bundleGroups.set(line.bundleId, group);
    } else {
      soloLines.push(line);
    }
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        {Array.from(bundleGroups.entries()).map(([bundleId, groupLines]) => {
          // Only the 4 paid vials get the 25% off — the free item is
          // already $0, not a 25%-off item, so it's excluded from this math.
          const vialSubtotal = groupLines
            .filter((l) => !l.isGift)
            .reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
          return (
            <div
              key={bundleId}
              className="holo-border-static rounded-2xl p-5 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-display text-xs font-black uppercase tracking-wide text-fg">
                  🧪 Your Bundle
                  <span className="text-gradient-holo">
                    {BUNDLE_DISCOUNT_RATE * 100}% Off
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => removeBundle(bundleId)}
                  className="text-xs font-semibold text-fg-faint hover:text-danger"
                >
                  Remove bundle
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {groupLines.map((line) => (
                  <BundleItemRow key={`${line.product.slug}:${line.variationId ?? "base"}`} line={line} />
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t border-border-soft pt-3 text-xs">
                <span className="text-fg-muted">4 vials, 25% off</span>
                <span className="font-semibold text-fg">
                  ${(vialSubtotal * (1 - BUNDLE_DISCOUNT_RATE)).toFixed(2)}{" "}
                  <span className="text-fg-faint line-through">
                    ${vialSubtotal.toFixed(2)}
                  </span>
                </span>
              </div>
            </div>
          );
        })}

        {soloLines.map(({ product, qty, variation, variationId, unitPrice, unitRegularPrice, isGift }) => {
          const image = variation?.image ?? product.image;
          return (
            <div
              key={`${product.slug}:${variationId ?? "base"}`}
              className={`flex items-center gap-5 rounded-2xl border p-5 ${isGift ? "border-steel-500/50 bg-steel-700/10" : "border-border bg-surface/60"}`}
            >
              {image ? (
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#eef1f3]">
                  <Image
                    src={image}
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
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {(variation?.label ?? product.size) && (
                    <span className="flex w-fit items-center rounded-full border border-steel-500/50 bg-steel-700/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-steel-300">
                      {variation?.label ?? product.size}
                    </span>
                  )}
                  {isGift && (
                    <span className="flex w-fit items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                      🎁 Free Gift
                    </span>
                  )}
                </div>
              </div>

              {isGift ? (
                <span className="w-9 text-center text-sm text-fg-faint">
                  &times;{qty}
                </span>
              ) : (
                <div className="flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    onClick={() => updateQty(product.slug, qty - 1, variationId)}
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
                    onClick={() => updateQty(product.slug, qty + 1, variationId)}
                    className="flex h-9 w-9 items-center justify-center text-fg-muted hover:text-fg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}

              {isGift ? (
                <div className="w-16 text-right">
                  <p className="text-xs text-fg-faint line-through">
                    ${(unitRegularPrice * qty).toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-emerald-300">Free</p>
                </div>
              ) : (
                <p className="w-16 text-right text-sm font-semibold text-fg">
                  ${(unitPrice * qty).toFixed(2)}
                </p>
              )}

              {isGift ? (
                <span className="w-[18px]" aria-hidden />
              ) : (
                <button
                  type="button"
                  onClick={() => removeItem(product.slug, variationId)}
                  aria-label="Remove item"
                  className="text-fg-faint hover:text-danger"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-fit rounded-2xl border border-border bg-surface/60 p-6">
        <h2 className="font-display text-lg font-black uppercase tracking-wide text-fg">
          Order Summary
        </h2>

        <div className="mt-5 flex flex-col gap-4">
          <FreeShippingProgress subtotal={subtotal} forceUnlocked={discounts.bundleQualifies} />
          <GiftProgress subtotal={giftSubtotal} hasBundle={discounts.bundleQualifies} />
          <SpendDiscountProgress subtotal={subtotal} />
        </div>

        <div className="mt-5">
          <SavingsBadgeRow />
        </div>

        <div className="mt-5">
          <PromoCodeInput
            coupon={coupon}
            onApply={setCoupon}
          />
          {discounts.bundleQualifies && (
            <p className="mt-2 text-[11px] text-fg-faint">
              Codes don&rsquo;t apply to bundle items — it&rsquo;s already 25% off.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-border-soft pt-5 text-sm">
          <div className="flex justify-between text-fg-muted">
            <span>Subtotal</span>
            <span className="text-fg">${subtotal.toFixed(2)}</span>
          </div>
          {discounts.bulkQualifies && (
            <div className="flex justify-between text-steel-300">
              <span>{BULK_TIERS.bulk.label} discount</span>
              <span>-${discounts.bulkAmount.toFixed(2)}</span>
            </div>
          )}
          {discounts.kitQualifies && (
            <div className="flex justify-between text-steel-300">
              <span>{BULK_TIERS.kit.label} discount</span>
              <span>-${discounts.kitAmount.toFixed(2)}</span>
            </div>
          )}
          {discounts.spendTier && (
            <div className="flex justify-between text-steel-300">
              <span>Spend ${discounts.spendTier.min}+ reward</span>
              <span>-${discounts.spendAmount.toFixed(2)}</span>
            </div>
          )}
          {discounts.bundleQualifies && (
            <div className="flex justify-between text-steel-300">
              <span>Build-a-Bundle discount ({BUNDLE_DISCOUNT_RATE * 100}%)</span>
              <span>-${discounts.bundleAmount.toFixed(2)}</span>
            </div>
          )}
          {discounts.affiliateApplied && (
            <div className="flex justify-between text-steel-300">
              <span>Affiliate code &ldquo;{discounts.affiliateCode}&rdquo;</span>
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

function BundleItemRow({ line }: { line: CartLine }) {
  const { product, variation, unitPrice, unitRegularPrice, isGift } = line;
  const image = variation?.image ?? product.image;
  return (
    <div className="flex items-center gap-3">
      {image ? (
        <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-[#eef1f3]">
          <Image src={image} alt={product.name} fill className="object-contain p-1" sizes="36px" />
        </div>
      ) : (
        <div className="h-12 w-9 shrink-0 rounded-lg border border-chrome-500/30 bg-gradient-to-b from-surface-3 to-surface" />
      )}
      <div className="flex-1">
        <p className="text-xs font-semibold text-fg">{product.name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {(variation?.label ?? product.size) && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-steel-300">
              {variation?.label ?? product.size}
            </span>
          )}
          {isGift && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-300">
              Included Free
            </span>
          )}
        </div>
      </div>
      {isGift ? (
        <div className="text-right">
          <p className="text-[10px] text-fg-faint line-through">
            ${unitRegularPrice.toFixed(2)}
          </p>
          <p className="text-xs font-semibold text-emerald-300">Free</p>
        </div>
      ) : (
        <p className="text-xs font-semibold text-fg">${unitPrice.toFixed(2)}</p>
      )}
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
