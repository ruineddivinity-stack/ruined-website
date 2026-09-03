"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { getStoredReferralCode } from "@/lib/referral-capture";
import type { Product } from "@/lib/types";
import { FreeShippingProgress } from "@/components/cart/FreeShippingProgress";
import { SpendDiscountProgress } from "@/components/cart/SpendDiscountProgress";
import { GiftProgress } from "@/components/cart/GiftProgress";
import { SavingsBadgeRow } from "@/components/cart/SavingsBadgeRow";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import {
  calculateDiscounts,
  SHIPPING_METHODS,
  PICKUP_LABEL,
  BULK_TIERS,
  BUNDLE_DISCOUNT_RATE,
  CASHAPP_TAG,
  type ShippingMethod,
} from "@/lib/discounts";
import { resolveCartLines, type CartLine } from "@/lib/cart-lines";
import { CashAppIcon } from "@/components/checkout/CashAppIcon";
import { CashAppPaymentPanel } from "@/components/checkout/CashAppPaymentPanel";

type FulfillmentMethod = "ship" | "pickup";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
  "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
  "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
  "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI",
  "WY",
];

type ShippingForm = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
};

const EMPTY_SHIPPING: ShippingForm = {
  firstName: "",
  lastName: "",
  address1: "",
  city: "",
  state: "",
  postcode: "",
};

export function CheckoutClient({ products }: { products: Product[] }) {
  const { items, coupon, setCoupon } = useCart();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [shipping, setShipping] = useState<ShippingForm>(EMPTY_SHIPPING);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("ship");
  const [creditBalance, setCreditBalance] = useState(0);
  const [useCredit, setUseCredit] = useState(true);
  const [placedOrder, setPlacedOrder] = useState<{
    orderId: number;
    orderKey: string;
    total: number;
  } | null>(null);
  const isPickup = fulfillment === "pickup";
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [error]);

  useEffect(() => {
    fetch("/api/account/store-credit")
      .then((res) => res.json())
      .then((data) => setCreditBalance(Number(data.balance) || 0))
      .catch(() => setCreditBalance(0));
  }, []);

  const lines = resolveCartLines(items, products);

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
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
  const shippingCost =
    isPickup || lines.length === 0 || discounts.freeShipping
      ? 0
      : SHIPPING_METHODS[shippingMethod].price;
  const creditApplied = useCredit ? Math.min(creditBalance, discounts.total) : 0;
  const total = Math.max(0, discounts.total - creditApplied) + shippingCost;

  const formValid =
    email.trim() !== "" &&
    shipping.firstName.trim() !== "" &&
    shipping.lastName.trim() !== "" &&
    (isPickup ||
      (shipping.address1.trim() !== "" &&
        shipping.city.trim() !== "" &&
        shipping.state.trim() !== "" &&
        shipping.postcode.trim() !== ""));

  const handlePlaceOrder = async () => {
    setError(null);

    if (!formValid) {
      setError("Please fill in your contact and shipping details first.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          promoCode: coupon?.code ?? "",
          email,
          shipping,
          shippingMethod,
          fulfillmentMethod: fulfillment,
          useStoreCredit: useCredit && creditBalance > 0,
          referralCode: getStoredReferralCode(),
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok || !body.success) {
        setError(body.error ?? "Your order couldn't be placed. Please try again.");
        setSubmitting(false);
        return;
      }

      setPlacedOrder({ orderId: body.orderId, orderKey: body.orderKey, total });
      setSubmitting(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = () => {
    if (!placedOrder) return;
    router.push(
      `/order-confirmation/${placedOrder.orderId}?key=${placedOrder.orderKey}`,
    );
  };

  if (placedOrder) {
    return (
      <div className="mt-16">
        <CashAppPaymentPanel
          amount={placedOrder.total}
          orderNumber={String(placedOrder.orderId)}
          onConfirm={handleConfirmPayment}
        />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-5 rounded-3xl border border-border bg-surface/60 px-8 py-16 text-center">
        <p className="text-sm text-fg-muted">
          Your cart is empty — add something before checking out.
        </p>
        <Button href="/shop">Shop the Catalog</Button>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
      <div className="flex flex-col gap-10 lg:col-span-2">
        {error && (
          <div
            ref={errorRef}
            role="alert"
            className="flex items-start gap-3 rounded-2xl border-2 border-danger bg-danger/15 px-5 py-4 shadow-[0_0_24px_2px_rgba(196,84,74,0.25)]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-danger"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="13" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm font-semibold text-fg">{error}</p>
          </div>
        )}

        <FormSection step={1} title="Fulfillment Method">
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setFulfillment("ship")}
              className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                fulfillment === "ship"
                  ? "border-steel-500 bg-steel-700/15 text-fg"
                  : "border-border text-fg-muted hover:border-steel-500/50"
              }`}
            >
              Shipping
            </button>
            <button
              type="button"
              onClick={() => setFulfillment("pickup")}
              className={`flex-1 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                fulfillment === "pickup"
                  ? "border-steel-500 bg-steel-700/15 text-fg"
                  : "border-border text-fg-muted hover:border-steel-500/50"
              }`}
            >
              {PICKUP_LABEL}
            </button>
          </div>
          {isPickup && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-200 sm:col-span-2">
              Pickup is by prior arrangement only. If you already have an
              established contact on our team, you&rsquo;ll know exactly how
              this works &mdash; if you don&rsquo;t, this probably isn&rsquo;t
              the option for you. We&rsquo;re not responsible if you select
              pickup and can&rsquo;t complete it; all sales are final.
              Questions about eligibility? Email{" "}
              <a href="mailto:support@ruinedrx.com" className="underline">
                support@ruinedrx.com
              </a>{" "}
              before ordering.
            </div>
          )}
        </FormSection>

        <FormSection step={2} title="Contact">
          <Field
            label="Email"
            type="email"
            placeholder="you@lab.com"
            value={email}
            onChange={setEmail}
            full
          />
        </FormSection>

        <FormSection step={3} title={isPickup ? "Your Name" : "Shipping Address"}>
          <Field
            label="First Name"
            placeholder="Jane"
            value={shipping.firstName}
            onChange={(v) => setShipping((s) => ({ ...s, firstName: v }))}
          />
          <Field
            label="Last Name"
            placeholder="Researcher"
            value={shipping.lastName}
            onChange={(v) => setShipping((s) => ({ ...s, lastName: v }))}
          />
          {!isPickup && (
            <>
              <Field
                label="Address"
                placeholder="123 Lab St"
                value={shipping.address1}
                onChange={(v) => setShipping((s) => ({ ...s, address1: v }))}
                full
              />
              <Field
                label="City"
                placeholder="Austin"
                value={shipping.city}
                onChange={(v) => setShipping((s) => ({ ...s, city: v }))}
              />
              <StateSelect
                value={shipping.state}
                onChange={(v) => setShipping((s) => ({ ...s, state: v }))}
              />
              <Field
                label="ZIP Code"
                placeholder="78701"
                value={shipping.postcode}
                onChange={(v) => setShipping((s) => ({ ...s, postcode: v }))}
              />
            </>
          )}
        </FormSection>

        <FormSection step={4} title="Payment" last>
          <div className="sm:col-span-2">
            <div className="flex items-start gap-3 rounded-2xl border border-steel-600/50 bg-steel-700/15 px-5 py-4 text-sm leading-relaxed text-fg">
              <CashAppIcon className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Pay with CashApp</p>
                <p className="mt-1.5 text-fg-muted">
                  Place your order below and we&rsquo;ll show you a QR code
                  and payment details for sending{" "}
                  <span className="font-semibold text-fg">
                    ${total.toFixed(2)}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-fg">{CASHAPP_TAG}</span>{" "}
                  on CashApp.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border-2 border-danger bg-danger/15 px-5 py-4 text-left">
              <p className="text-sm font-black uppercase leading-relaxed text-danger">
                Do NOT mention peptides or any product names in the CashApp
                note &mdash; only your order number. Mentioning them will get
                you a warning and can get you banned from buying.
              </p>
            </div>

            <Button
              type="button"
              disabled={!formValid || submitting}
              onClick={handlePlaceOrder}
              className="mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? "Placing Order…" : `Place Order — $${total.toFixed(2)}`}
            </Button>

            {!formValid && (
              <p className="mt-3 text-xs text-fg-faint">
                Fill in your contact and shipping details above to place your
                order.
              </p>
            )}
          </div>
        </FormSection>
      </div>

      <div className="order-first h-fit rounded-2xl border border-border bg-surface/60 p-6 lg:order-none">
        <h2 className="font-display text-lg font-black uppercase tracking-wide text-fg">
          Order Summary
        </h2>

        <div className="mt-5 flex flex-col gap-4">
          {Array.from(bundleGroups.entries()).map(([bundleId, groupLines]) => (
            <div key={bundleId} className="holo-border-static rounded-xl p-3.5 backdrop-blur-md">
              <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-fg">
                🧪 Your Bundle{" "}
                <span className="text-gradient-holo">{BUNDLE_DISCOUNT_RATE * 100}% Off</span>
              </span>
              <div className="mt-2.5 flex flex-col gap-2">
                {groupLines.map((line) => (
                  <div
                    key={`${line.product.slug}:${line.variationId ?? "base"}`}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="truncate text-fg">
                      {line.product.name}
                      {line.variation?.label ? ` (${line.variation.label})` : ""}
                      {line.isGift && (
                        <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                          Included Free
                        </span>
                      )}
                    </span>
                    <span className={line.isGift ? "shrink-0 font-semibold text-emerald-300" : "shrink-0 text-fg-faint"}>
                      {line.isGift ? "Free" : `$${line.unitPrice.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {soloLines.map(({ product, qty, variation, variationId, unitPrice, isGift }) => {
            const image = variation?.image ?? product.image;
            return (
              <div
                key={`${product.slug}:${variationId ?? "base"}`}
                className="flex items-center gap-4"
              >
                {image ? (
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#eef1f3]">
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                      sizes="44px"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg border border-chrome-500/30 bg-gradient-to-b from-surface-3 to-surface">
                    <span className="font-display text-[6px] font-semibold tracking-widest text-gradient-holo">
                      RUINED
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-fg">
                      {product.name}
                    </p>
                    {variation?.label && (
                      <span className="inline-flex items-center rounded-full border border-steel-500/50 bg-steel-700/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-steel-300">
                        {variation.label}
                      </span>
                    )}
                    {isGift && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                        🎁 Gift
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-fg-faint">Qty {qty}</p>
                </div>
                <p
                  className={`text-sm font-semibold ${isGift ? "text-emerald-300" : "text-fg"}`}
                >
                  {isGift ? "Free" : `$${(unitPrice * qty).toFixed(2)}`}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4">
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

        {creditBalance > 0 && (
          <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-steel-600/50 bg-steel-700/15 px-4 py-3 text-sm">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useCredit}
                onChange={(e) => setUseCredit(e.target.checked)}
                className="accent-steel-500"
              />
              <span className="text-fg">
                Use ${creditBalance.toFixed(2)} store credit
              </span>
            </span>
          </label>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-border-soft pt-5 text-sm">
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
          {creditApplied > 0 && (
            <div className="flex justify-between text-steel-300">
              <span>Store credit</span>
              <span>-${creditApplied.toFixed(2)}</span>
            </div>
          )}
          {isPickup ? (
            <div className="flex justify-between text-fg-muted">
              <span>Shipping</span>
              <span className="text-fg">{PICKUP_LABEL} — $0.00</span>
            </div>
          ) : discounts.freeShipping ? (
            <div className="flex justify-between text-fg-muted">
              <span>Shipping</span>
              <span className="text-fg">Free</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-fg-muted">Shipping</span>
              {(Object.keys(SHIPPING_METHODS) as ShippingMethod[]).map((key) => {
                const method = SHIPPING_METHODS[key];
                return (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-xs transition-colors ${
                      shippingMethod === key
                        ? "border-steel-500 bg-steel-700/15"
                        : "border-border hover:border-steel-500/50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === key}
                        onChange={() => setShippingMethod(key)}
                        className="accent-steel-500"
                      />
                      <span className="text-fg">{method.label}</span>
                    </span>
                    <span className="font-semibold text-fg">
                      ${method.price.toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-between border-t border-border-soft pt-5 text-base font-semibold text-fg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-fg-faint">
          For laboratory research use only. Not for human or animal
          consumption.
        </p>
        <Link
          href="/cart"
          className="mt-4 block text-center text-xs text-fg-muted hover:text-fg"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}

function FormSection({
  step,
  title,
  last = false,
  children,
}: {
  step: number;
  title: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-steel-500 text-xs font-bold text-black shadow-[0_0_12px_1px_rgba(31,200,221,0.45)]">
          {step}
        </span>
        {!last && <span className="mt-2 w-px flex-1 bg-steel-500/25" />}
      </div>
      <div className="flex-1 pb-2">
        <h2 className="font-display text-sm font-black uppercase tracking-widest text-fg">
          {title}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  full = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
      />
    </label>
  );
}

function StateSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
        State
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg focus:border-steel-500 focus:outline-none"
      >
        <option value="" disabled>
          Select state
        </option>
        {US_STATES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </label>
  );
}
