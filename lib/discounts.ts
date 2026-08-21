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
  bulk: { min: 3, max: 9, rate: 0.1, label: "3-9 Vials" },
  kit: { min: 10, rate: 0.3, label: "Kit (10+ Vials)" },
} as const;

export const SPEND_TIERS = [
  { min: 500, amount: 50 },
  { min: 300, amount: 30 },
] as const;

export type GiftItem = { slug: string; variationLabel?: string };

/** Free-gift tiers — non-cumulative, the customer gets the single highest one they clear. */
export const GIFT_TIERS: { min: number; label: string; items: GiftItem[] }[] = [
  {
    min: 250,
    label: "Free GHK-CU 100MG + BAC Water",
    items: [
      { slug: "ghk-cu", variationLabel: "100MG" },
      { slug: "hospira-b-a-c-water-10ml" },
    ],
  },
  {
    min: 200,
    label: "Free GHK-CU 50MG",
    items: [{ slug: "ghk-cu", variationLabel: "50MG" }],
  },
  {
    min: 150,
    label: "Free Shipping + Free BAC Water",
    items: [{ slug: "hospira-b-a-c-water-10ml" }],
  },
  {
    min: 100,
    label: "Free BAC Water",
    items: [{ slug: "hospira-b-a-c-water-10ml" }],
  },
];

export function getGiftTier(subtotal: number) {
  return GIFT_TIERS.find((t) => subtotal >= t.min) ?? null;
}

export const AFFILIATE_CODE = "RX";
export const AFFILIATE_RATE = 0.1;

/** The lifetime 10%-off code emailed to anyone who joins the subscriber list. */
export const SUBSCRIBER_CODE = "RUINEDLIFE";

export type AppliedCoupon = {
  code: string;
  discountType: string;
  amount: number;
};

/** Advertised combined savings when a bulk tier is stacked with an affiliate code. */
export const STACKED_SAVINGS_PCT = {
  bulk: 20,
  kit: 40,
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
  /** Free-gift lines are excluded from bulk/kit quantity discounts too. */
  isGift?: boolean;
};

export type DiscountBreakdown = {
  subtotal: number;
  /** 3-9 tier — any mix of vials, applied to whatever isn't already Kit-qualifying. */
  bulkAmount: number;
  bulkQualifies: boolean;
  /** Kit tier — only lines with 10+ of the SAME vial, applied per line. */
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

  // Kit (10+) requires that many of the SAME vial — it's judged per line, not
  // the cart's combined quantity. The 3-9 tier is looser: it's any mix of
  // vials, applied to whatever's left over after pulling out lines that
  // already qualified for Kit (so the same units never get discounted twice).
  const eligibleLines = lines.filter((l) => !l.isBundle && !l.isGift);
  let kitAmount = 0;
  let mixedSubtotal = 0;
  let mixedQty = 0;
  for (const line of eligibleLines) {
    if (line.qty >= BULK_TIERS.kit.min) {
      kitAmount += line.subtotal * BULK_TIERS.kit.rate;
    } else {
      mixedSubtotal += line.subtotal;
      mixedQty += line.qty;
    }
  }
  const bulkAmount =
    mixedQty >= BULK_TIERS.bulk.min ? mixedSubtotal * BULK_TIERS.bulk.rate : 0;

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
