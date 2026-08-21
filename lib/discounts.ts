export const FREE_SHIPPING_THRESHOLD = 150;

export const SHIPPING_METHODS = {
  standard: { label: "Standard Shipping", price: 13.99 },
  express: { label: "Express Shipping", price: 34.99 },
} as const;

export type ShippingMethod = keyof typeof SHIPPING_METHODS;

export function isShippingMethod(value: unknown): value is ShippingMethod {
  return typeof value === "string" && value in SHIPPING_METHODS;
}

export const PICKUP_METHOD_ID = "local_pickup";
export const PICKUP_LABEL = "Pickup — Local Customers Only";

export const BULK_TIERS = {
  bulk: { min: 3, max: 9, rate: 0.08, label: "3-9 Vials" },
  kit: { min: 10, rate: 0.2, label: "Kit (10+ Vials)" },
} as const;

export const SPEND_TIERS = [
  { min: 500, amount: 50 },
  { min: 300, amount: 30 },
] as const;

export const AFFILIATE_CODE = "RX";
export const AFFILIATE_RATE = 0.1;

export type AppliedCoupon = {
  code: string;
  discountType: string;
  amount: number;
};

/** Advertised combined savings when a bulk tier is stacked with an affiliate code. */
export const STACKED_SAVINGS_PCT = {
  bulk: 18,
  kit: 30,
} as const;

export function getBulkTier(qty: number) {
  if (qty >= BULK_TIERS.kit.min) return BULK_TIERS.kit;
  if (qty >= BULK_TIERS.bulk.min) return BULK_TIERS.bulk;
  return null;
}

export function getSpendTier(subtotal: number) {
  return SPEND_TIERS.find((t) => subtotal >= t.min) ?? null;
}

export type DiscountLine = {
  subtotal: number;
  qty: number;
  /** Bundle products are excluded from bulk/kit quantity discounts. */
  isBundle: boolean;
};

export type DiscountBreakdown = {
  subtotal: number;
  /** Sum of 3-9 tier discounts — only lines that individually hit 3-9 qty. */
  bulkAmount: number;
  bulkQualifies: boolean;
  /** Sum of 10+ tier discounts — only lines that individually hit 10+ qty. */
  kitAmount: number;
  kitQualifies: boolean;
  spendTier: ReturnType<typeof getSpendTier>;
  spendAmount: number;
  affiliateApplied: boolean;
  affiliateAmount: number;
  affiliateCode: string | null;
  total: number;
  freeShipping: boolean;
  amountToFreeShipping: number;
};

export function calculateDiscounts(
  lines: DiscountLine[],
  coupon?: AppliedCoupon | null,
): DiscountBreakdown {
  const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);

  // Bulk/kit pricing requires 3-9 (or 10+) of the SAME line — buying 2 of one
  // vial and 2 of another doesn't combine to hit the threshold. Each line is
  // judged on its own quantity, not the cart's combined eligible quantity.
  const eligibleLines = lines.filter((l) => !l.isBundle);
  let bulkAmount = 0;
  let kitAmount = 0;
  for (const line of eligibleLines) {
    if (line.qty >= BULK_TIERS.kit.min) {
      kitAmount += line.subtotal * BULK_TIERS.kit.rate;
    } else if (line.qty >= BULK_TIERS.bulk.min) {
      bulkAmount += line.subtotal * BULK_TIERS.bulk.rate;
    }
  }

  const spendTier = getSpendTier(subtotal);
  const spendAmount = spendTier?.amount ?? 0;

  const preAffiliate = subtotal - bulkAmount - kitAmount - spendAmount;
  const affiliateApplied = !!coupon;
  const affiliateAmount = coupon
    ? coupon.discountType === "percent"
      ? preAffiliate * (coupon.amount / 100)
      : Math.min(preAffiliate, coupon.amount)
    : 0;

  const total = Math.max(0, preAffiliate - affiliateAmount);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return {
    subtotal,
    bulkAmount,
    bulkQualifies: bulkAmount > 0,
    kitAmount,
    kitQualifies: kitAmount > 0,
    spendTier,
    spendAmount,
    affiliateApplied,
    affiliateAmount,
    affiliateCode: coupon?.code ?? null,
    total,
    freeShipping,
    amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  };
}
