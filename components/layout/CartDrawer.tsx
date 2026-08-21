"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";
import { FreeShippingProgress } from "@/components/cart/FreeShippingProgress";
import { SpendDiscountProgress } from "@/components/cart/SpendDiscountProgress";
import { GiftProgress } from "@/components/cart/GiftProgress";
import { SavingsBadgeRow } from "@/components/cart/SavingsBadgeRow";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import { calculateDiscounts, BULK_TIERS } from "@/lib/discounts";
import { resolveCartLines } from "@/lib/cart-lines";

const overlayVariants = { closed: { opacity: 0 }, open: { opacity: 1 } };
const panelVariants = { closed: { x: "100%" }, open: { x: "0%" } };

export function CartDrawer({ products }: { products: Product[] }) {
  const { items, isOpen, closeCart, updateQty, removeItem, coupon, setCoupon } =
    useCart();

  const lines = resolveCartLines(items, products);

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const discounts = calculateDiscounts(
    lines.map((l) => ({
      subtotal: l.unitPrice * l.qty,
      qty: l.qty,
      isBundle: l.product.type === "bundle",
    })),
    coupon,
  );

  return (
    <>
      <motion.div
        onClick={closeCart}
        aria-hidden
        className="fixed inset-0 z-50 bg-black/60"
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        variants={overlayVariants}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      <motion.div
        role="dialog"
        aria-label="Cart"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-surface"
        variants={panelVariants}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        transition={{ type: "spring", stiffness: 340, damping: 34, mass: 1 }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[2px]"
          style={{
            background:
              "linear-gradient(180deg, var(--color-holo-violet), var(--color-holo-blue), var(--color-holo-pink), var(--color-holo-gold))",
          }}
          animate={isOpen ? { opacity: [0, 1, 0.6] } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        />
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-5">
          <h2 className="font-display text-lg font-black uppercase tracking-wide text-fg">
            Your Cart
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-fg-muted hover:text-fg"
          >
            <CloseIcon />
          </button>
        </div>

        {lines.length > 0 && (
          <div className="flex flex-col gap-4 border-b border-border-soft px-6 py-4">
            <FreeShippingProgress subtotal={subtotal} />
            <GiftProgress subtotal={subtotal} />
            <SpendDiscountProgress subtotal={subtotal} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {lines.length === 0 ? (
            <p className="text-sm text-fg-muted">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {lines.map(({ product, qty, variation, variationId, unitPrice }) => {
                const image = variation?.image ?? product.image;
                return (
                  <div
                    key={`${product.slug}:${variationId ?? "base"}`}
                    className="flex items-start gap-4"
                  >
                    {image ? (
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-[#eef1f3]">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg border border-chrome-500/30 bg-gradient-to-b from-surface-3 to-surface">
                        <span className="font-display text-[7px] font-semibold tracking-widest text-gradient-holo">
                          RUINED
                        </span>
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-fg">
                        {product.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-xs text-fg-faint">
                          ${unitPrice.toFixed(2)}
                        </p>
                        {(variation?.label ?? product.size) && (
                          <span className="inline-flex items-center rounded-full border border-steel-500/50 bg-steel-700/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-steel-300">
                            {variation?.label ?? product.size}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex w-fit items-center rounded-full border border-border">
                        <button
                          type="button"
                          onClick={() => updateQty(product.slug, qty - 1, variationId)}
                          className="flex h-7 w-7 items-center justify-center text-fg-muted hover:text-fg"
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-fg">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.slug, qty + 1, variationId)}
                          className="flex h-7 w-7 items-center justify-center text-fg-muted hover:text-fg"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(product.slug, variationId)}
                      aria-label="Remove item"
                      className="text-fg-faint hover:text-danger"
                    >
                      <CloseIcon small />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border-soft px-6 py-5">
            <SavingsBadgeRow />

            <div className="mt-4">
              <PromoCodeInput
                applied={discounts.affiliateApplied}
                onApply={setCoupon}
              />
            </div>

            <div className="mt-4 flex flex-col gap-1.5 text-sm">
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
              {discounts.affiliateApplied && (
                <div className="flex justify-between text-steel-300">
                  <span>Affiliate code &ldquo;{discounts.affiliateCode}&rdquo;</span>
                  <span>-${discounts.affiliateAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex justify-between border-t border-border-soft pt-3 text-sm font-semibold text-fg">
              <span>Total</span>
              <span>${discounts.total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-4 flex w-full items-center justify-center rounded-full bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 px-6 py-3 text-sm font-semibold text-black transition-transform hover:brightness-110"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="mt-3 block text-center text-xs text-fg-muted hover:text-fg"
            >
              View full cart
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
}

function CloseIcon({ small }: { small?: boolean }) {
  const size = small ? 16 : 18;
  return (
    <svg
      width={size}
      height={size}
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
