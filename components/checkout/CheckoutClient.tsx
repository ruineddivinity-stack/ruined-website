"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";
import { FreeShippingProgress } from "@/components/cart/FreeShippingProgress";
import { SpendDiscountProgress } from "@/components/cart/SpendDiscountProgress";
import { SavingsBadgeRow } from "@/components/cart/SavingsBadgeRow";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import { calculateDiscounts } from "@/lib/discounts";
import { SquarePaymentForm } from "@/components/checkout/SquarePaymentForm";

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
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [email, setEmail] = useState("");
  const [shipping, setShipping] = useState<ShippingForm>(EMPTY_SHIPPING);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
  const shippingCost = lines.length > 0 && !discounts.freeShipping ? 8 : 0;
  const total = discounts.total + shippingCost;

  const formValid =
    email.trim() !== "" &&
    shipping.firstName.trim() !== "" &&
    shipping.lastName.trim() !== "" &&
    shipping.address1.trim() !== "" &&
    shipping.city.trim() !== "" &&
    shipping.state.trim() !== "" &&
    shipping.postcode.trim() !== "";

  const handleToken = async (sourceId: string) => {
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
          promoCode,
          sourceId,
          email,
          shipping,
        }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok || !body.success) {
        setError(body.error ?? "Payment could not be processed. Please try again.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${body.orderId}?key=${body.orderKey}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

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
        <FormSection title="Contact">
          <Field
            label="Email"
            type="email"
            placeholder="you@lab.com"
            value={email}
            onChange={setEmail}
            full
          />
        </FormSection>

        <FormSection title="Shipping Address">
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
          <Field
            label="State"
            placeholder="TX"
            value={shipping.state}
            onChange={(v) => setShipping((s) => ({ ...s, state: v }))}
          />
          <Field
            label="ZIP Code"
            placeholder="78701"
            value={shipping.postcode}
            onChange={(v) => setShipping((s) => ({ ...s, postcode: v }))}
          />
        </FormSection>

        <FormSection title="Payment">
          <div className="sm:col-span-2">
            <SquarePaymentForm
              amount={total}
              disabled={!formValid || submitting}
              onToken={handleToken}
              onError={setError}
            />
            {!formValid && (
              <p className="mt-3 text-xs text-fg-faint">
                Fill in your contact and shipping details above to enable
                payment.
              </p>
            )}
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          </div>
        </FormSection>
      </div>

      <div className="h-fit rounded-2xl border border-border bg-surface/60 p-6">
        <h2 className="font-display text-lg font-black uppercase tracking-wide text-fg">
          Order Summary
        </h2>

        <div className="mt-5 flex flex-col gap-4">
          {lines.map(({ product, qty }) => (
            <div key={product.slug} className="flex items-center gap-4">
              {product.image ? (
                <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#eef1f3]">
                  <Image
                    src={product.image}
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
                <p className="text-sm font-semibold text-fg">
                  {product.name}
                </p>
                <p className="text-xs text-fg-faint">Qty {qty}</p>
              </div>
              <p className="text-sm font-semibold text-fg">
                ${(product.price * qty).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4">
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

        <div className="mt-6 flex flex-col gap-3 border-t border-border-soft pt-5 text-sm">
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
              {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
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
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-sm font-black uppercase tracking-widest text-fg">
        {title}
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children}
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
