import { NextResponse } from "next/server";
import { getAllProducts, createOrder, getCouponByCode } from "@/lib/woocommerce";
import {
  calculateDiscounts,
  SHIPPING_METHODS,
  isShippingMethod,
  PICKUP_LABEL,
  BULK_TIERS,
  getGiftTier,
  BUNDLE_VIAL_COUNT,
  BUNDLE_DISCOUNT_RATE,
  BUNDLE_FREE_ITEM_SLUG,
} from "@/lib/discounts";
import { isBundleEligible } from "@/lib/bundle";
import { getSession } from "@/lib/session";
import { resolveCartLines } from "@/lib/cart-lines";
import { getReferralBalance, redeemReferralCredit } from "@/lib/referral";

type CheckoutRequestBody = {
  items: {
    slug: string;
    qty: number;
    variationId?: number;
    isGift?: boolean;
    isBundlePick?: boolean;
    bundleId?: string;
  }[];
  promoCode?: string;
  email: string;
  shipping: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postcode: string;
  };
  shippingMethod?: string;
  fulfillmentMethod?: string;
  useStoreCredit?: boolean;
  referralCode?: string | null;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutRequestBody;

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const isPickup = body.fulfillmentMethod === "pickup";

  const required = isPickup
    ? [body.email, body.shipping?.firstName, body.shipping?.lastName]
    : [
        body.email,
        body.shipping?.firstName,
        body.shipping?.lastName,
        body.shipping?.address1,
        body.shipping?.city,
        body.shipping?.state,
        body.shipping?.postcode,
      ];
  if (required.some((v) => !v || !v.trim())) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  const products = await getAllProducts();
  const rawLines = resolveCartLines(body.items, products).filter((l) => l.qty > 0);

  if (rawLines.length === 0) {
    return NextResponse.json(
      { error: "None of the items in your cart are available anymore." },
      { status: 400 },
    );
  }

  // The client marks which lines it believes belong to a Build-a-Bundle, but
  // that flag is just a UI hint — never trust it directly. Re-derive each
  // claimed bundle group and only honor it if it's exactly 4 distinct
  // bundle-eligible vials (+ optionally the one free item) with no
  // duplicates or tampered products; anything that doesn't validate falls
  // back to being billed as ordinary lines with no bundle discount.
  const bundleGroups = new Map<string, typeof rawLines>();
  for (const line of rawLines) {
    if (!line.bundleId) continue;
    const group = bundleGroups.get(line.bundleId) ?? [];
    group.push(line);
    bundleGroups.set(line.bundleId, group);
  }
  const verifiedBundleIds = new Set<string>();
  for (const [bundleId, groupLines] of bundleGroups) {
    const vialLines = groupLines.filter((l) => !l.isGift);
    const freeLines = groupLines.filter((l) => l.isGift);
    const distinctSlugs = new Set(vialLines.map((l) => l.product.slug));
    const valid =
      vialLines.length === BUNDLE_VIAL_COUNT &&
      distinctSlugs.size === BUNDLE_VIAL_COUNT &&
      vialLines.every((l) => l.qty === 1 && isBundleEligible(l.product)) &&
      freeLines.length <= 1 &&
      freeLines.every((l) => l.qty === 1 && l.product.slug === BUNDLE_FREE_ITEM_SLUG);
    if (valid) verifiedBundleIds.add(bundleId);
  }
  const allLines = rawLines.map((l) =>
    l.bundleId && !verifiedBundleIds.has(l.bundleId)
      ? { ...l, isBundlePick: false, bundleId: undefined }
      : l,
  );

  // The client also marks which lines it believes are free gifts, but that
  // flag is just a UI hint too — never trust it directly, since a tampered
  // request could mark any item isGift to get it for free. A claimed gift
  // line is only honored if it's either the verified free item from a
  // legitimate bundle above, or matches the real spend-tier gift ladder
  // (re-derived from the PAID lines only); anything else is billed at full
  // price like normal.
  const claimedGiftLines = allLines.filter((l) => l.isGift);
  const paidLines = allLines.filter((l) => !l.isGift);
  // Bundle-picked vials are excluded from tier-gift eligibility here too —
  // they already earn their own free item as part of the bundle, so they
  // shouldn't also count toward unlocking a second one from the spend ladder.
  const paidSubtotal = paidLines
    .filter((l) => !l.isBundlePick)
    .reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const giftTier = getGiftTier(paidSubtotal);
  const giftSpecKey = (slug: string, variationLabel?: string | null) =>
    `${slug}:${variationLabel ?? ""}`;
  // A verified bundle already includes its own free BAC Water — never also
  // honor a second, tier-based claim for that same product on top of it.
  const validGiftKeys = new Set(
    (giftTier?.items ?? [])
      .filter((i) => !(verifiedBundleIds.size > 0 && i.slug === BUNDLE_FREE_ITEM_SLUG))
      .map((i) => giftSpecKey(i.slug, i.variationLabel)),
  );

  const verifiedGiftLines: typeof allLines = [];
  const reclassifiedAsPaid: typeof allLines = [];
  const usedGiftKeys = new Set<string>();
  const usedBundleFreebies = new Set<string>();
  for (const line of claimedGiftLines) {
    const isBundleFreebie =
      line.bundleId &&
      verifiedBundleIds.has(line.bundleId) &&
      line.product.slug === BUNDLE_FREE_ITEM_SLUG &&
      line.qty === 1 &&
      !usedBundleFreebies.has(line.bundleId);
    if (isBundleFreebie) {
      usedBundleFreebies.add(line.bundleId!);
      if (line.inStock) verifiedGiftLines.push(line);
      // Out-of-stock bundle freebie is just dropped, same as tier gifts.
      continue;
    }

    const key = giftSpecKey(line.product.slug, line.variation?.label);
    const isLegitGift = validGiftKeys.has(key) && !usedGiftKeys.has(key) && line.qty === 1;
    if (!isLegitGift) {
      reclassifiedAsPaid.push(line);
      continue;
    }
    usedGiftKeys.add(key);
    if (!line.inStock) {
      // A legitimate gift that's out of stock is just dropped — never
      // charged, never blocks checkout.
      continue;
    }
    verifiedGiftLines.push(line);
  }

  const billableLines = [...paidLines, ...reclassifiedAsPaid];

  if (billableLines.length === 0) {
    return NextResponse.json(
      { error: "Your cart doesn't have anything to check out." },
      { status: 400 },
    );
  }

  for (const line of billableLines) {
    if (!line.inStock) {
      const label = line.variation ? ` (${line.variation.label})` : "";
      return NextResponse.json(
        { error: `${line.product.name}${label} is out of stock.` },
        { status: 400 },
      );
    }
  }

  let validCoupon: Awaited<ReturnType<typeof getCouponByCode>> = null;
  if (body.promoCode) {
    validCoupon = await getCouponByCode(body.promoCode);
    if (!validCoupon) {
      return NextResponse.json(
        { error: "That affiliate code isn't valid." },
        { status: 400 },
      );
    }
  }

  const discounts = calculateDiscounts(
    billableLines.map((l) => ({
      subtotal: l.unitPrice * l.qty,
      qty: l.qty,
      isBundle: l.product.type === "bundle",
      isBundlePick: l.isBundlePick,
    })),
    validCoupon,
  );
  const shippingMethod = isShippingMethod(body.shippingMethod)
    ? body.shippingMethod
    : "standard";
  const shippingTotal = isPickup || discounts.freeShipping
    ? 0
    : SHIPPING_METHODS[shippingMethod].price;

  const feeLines: { name: string; amount: number }[] = [];
  if (discounts.bulkQualifies) {
    feeLines.push({
      name: `${BULK_TIERS.bulk.label} discount`,
      amount: -discounts.bulkAmount,
    });
  }
  if (discounts.kitQualifies) {
    feeLines.push({
      name: `${BULK_TIERS.kit.label} discount`,
      amount: -discounts.kitAmount,
    });
  }
  if (discounts.spendTier && discounts.spendAmount > 0) {
    feeLines.push({
      name: `Spend $${discounts.spendTier.min}+ reward`,
      amount: -discounts.spendAmount,
    });
  }
  if (discounts.bundleQualifies) {
    feeLines.push({
      name: `Build-a-Bundle discount (${BUNDLE_DISCOUNT_RATE * 100}%)`,
      amount: -discounts.bundleAmount,
    });
  }

  // Verified gift lines: priced at $0.00 directly (not full price offset by
  // a fee line) so a discount code applied elsewhere in the order can't
  // compute its percentage off the gift's real retail price — WooCommerce's
  // native coupon engine works off each line's own price, blind to fee
  // lines, so a full-price line + offsetting fee was silently overcharging
  // whenever a code and a free gift landed in the same order.
  const giftLineItems: {
    productId: number;
    quantity: number;
    variationId?: number;
    metaData: { key: string; value: string }[];
    subtotal: string;
    total: string;
  }[] = [];
  for (const line of verifiedGiftLines) {
    const isBundleFreebie = line.bundleId && verifiedBundleIds.has(line.bundleId);
    giftLineItems.push({
      productId: line.product.id,
      quantity: 1,
      variationId: line.variationId,
      metaData: [
        {
          key: "🎁 Free Gift",
          value: isBundleFreebie
            ? "Build-a-Bundle 5th item"
            : `Unlocked at $${giftTier?.min ?? 0}+ spend`,
        },
      ],
      subtotal: "0.00",
      total: "0.00",
    });
  }

  // A discount code's own WooCommerce-native application applies against
  // every line item's full price, with no way to scope it away from just
  // the bundle's lines — so when a verified bundle is in the order, we
  // compute the code's effect ourselves (already correctly excluding the
  // bundle's subtotal) as a fee line instead of letting WooCommerce apply it
  // natively. This keeps "codes don't apply to the bundle" true for the
  // actual charged amount, not just the on-screen total.
  if (discounts.bundleQualifies && discounts.affiliateApplied && discounts.affiliateAmount > 0) {
    feeLines.push({
      name: `Code "${discounts.affiliateCode}" discount`,
      amount: -discounts.affiliateAmount,
    });
  }

  const session = await getSession();

  // Store credit is re-verified server-side against the live balance — never
  // trust the client-reported amount, and it only ever offsets up to what's
  // actually owed (post-discount, pre-shipping).
  let creditApplied = 0;
  if (body.useStoreCredit && session) {
    const balance = await getReferralBalance(session.username);
    creditApplied = Math.min(balance, discounts.total);
    if (creditApplied > 0) {
      feeLines.push({ name: "Store credit", amount: -creditApplied });
    }
  }

  const metaData: { key: string; value: string }[] = [];
  if (body.referralCode && body.referralCode.trim()) {
    metaData.push({ key: "_ruined_referred_by", value: body.referralCode.trim() });
  }

  let order;
  try {
    order = await createOrder({
      lineItems: [
        ...billableLines.map((l) => ({
          productId: l.product.id,
          quantity: l.qty,
          variationId: l.variationId,
          ...(l.isBundlePick
            ? {
                metaData: [
                  {
                    key: "🧪 Bundle Item",
                    value: `Build-a-Bundle — ${BUNDLE_DISCOUNT_RATE * 100}% off`,
                  },
                ],
              }
            : {}),
        })),
        ...giftLineItems,
      ],
      feeLines,
      couponCode: discounts.bundleQualifies ? undefined : validCoupon?.code,
      shippingTotal,
      isPickup,
      shippingMethodTitle: isPickup
        ? PICKUP_LABEL
        : discounts.freeShipping
          ? "Free Shipping"
          : SHIPPING_METHODS[shippingMethod].label,
      billing: {
        firstName: body.shipping.firstName,
        lastName: body.shipping.lastName,
        address1: body.shipping.address1 ?? "",
        city: body.shipping.city ?? "",
        state: body.shipping.state ?? "",
        postcode: body.shipping.postcode ?? "",
        country: "US",
        email: body.email,
      },
      customerId: session?.id,
      metaData,
      // No live payment processor right now — the order is created
      // "on-hold" and the customer pays manually via CashApp, confirmed by
      // staff. See lib/discounts.ts CASHAPP_TAG.
      paymentMethod: "cashapp_manual",
      paymentMethodTitle: "CashApp (Manual)",
      status: "on-hold",
    });
  } catch (err) {
    console.error("Order creation failed", err);
    return NextResponse.json(
      { error: "Could not create your order. Please try again." },
      { status: 500 },
    );
  }

  // There's no separate payment-success step to hook this to anymore since
  // payment is manual — debit the credit ledger as soon as the order (which
  // already bills the reduced, credit-applied total) exists.
  if (creditApplied > 0 && session) {
    try {
      await redeemReferralCredit(session.username, creditApplied);
    } catch (err) {
      console.error("Failed to redeem store credit after order creation", err);
    }
  }

  return NextResponse.json({
    success: true,
    orderId: order.id,
    orderKey: order.orderKey,
  });
}
