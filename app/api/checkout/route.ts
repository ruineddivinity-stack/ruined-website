import { NextResponse } from "next/server";
import { getAllProducts, createOrder, getCouponByCode } from "@/lib/woocommerce";
import {
  calculateDiscounts,
  SHIPPING_METHODS,
  isShippingMethod,
  PICKUP_LABEL,
  BULK_TIERS,
  getGiftTier,
} from "@/lib/discounts";
import { chargeOrderWithSquare } from "@/lib/square";
import { getSession } from "@/lib/session";
import { resolveCartLines } from "@/lib/cart-lines";
import { getReferralBalance, redeemReferralCredit } from "@/lib/referral";

type CheckoutRequestBody = {
  items: { slug: string; qty: number; variationId?: number; isGift?: boolean }[];
  promoCode?: string;
  sourceId: string;
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
  if (!body.sourceId) {
    return NextResponse.json(
      { error: "Missing payment details." },
      { status: 400 },
    );
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
  const allLines = resolveCartLines(body.items, products).filter((l) => l.qty > 0);

  if (allLines.length === 0) {
    return NextResponse.json(
      { error: "None of the items in your cart are available anymore." },
      { status: 400 },
    );
  }

  // The client marks which cart lines it believes are free gifts, but that
  // flag is just a UI hint — never trust it directly, since a tampered
  // request could mark any item isGift to get it for free. Re-derive the
  // real gift tier from the PAID lines only, then only let a claimed line
  // through free if it exactly matches one of that tier's real items;
  // anything else falls back to being billed at full price like normal.
  const claimedGiftLines = allLines.filter((l) => l.isGift);
  const paidLines = allLines.filter((l) => !l.isGift);
  const paidSubtotal = paidLines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const giftTier = getGiftTier(paidSubtotal);
  const giftSpecKey = (slug: string, variationLabel?: string | null) =>
    `${slug}:${variationLabel ?? ""}`;
  const validGiftKeys = new Set(
    (giftTier?.items ?? []).map((i) => giftSpecKey(i.slug, i.variationLabel)),
  );

  const verifiedGiftLines: typeof allLines = [];
  const reclassifiedAsPaid: typeof allLines = [];
  const usedGiftKeys = new Set<string>();
  for (const line of claimedGiftLines) {
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

  // Verified gift lines: real product/variation, real price charged by
  // WooCommerce off the product's own listing — offset by a matching fee
  // line so the net charge is $0, with a line-item note so it's unmistakable
  // in the order/packing-slip view during fulfillment.
  const giftLineItems: {
    productId: number;
    quantity: number;
    variationId?: number;
    metaData: { key: string; value: string }[];
  }[] = [];
  for (const line of verifiedGiftLines) {
    const price = line.variation ? line.variation.price : line.product.price;
    giftLineItems.push({
      productId: line.product.id,
      quantity: 1,
      variationId: line.variationId,
      metaData: [
        { key: "🎁 Free Gift", value: `Unlocked at $${giftTier?.min ?? 0}+ spend` },
      ],
    });
    feeLines.push({
      name: `Free gift: ${line.product.name}${line.variation ? ` (${line.variation.label})` : ""}`,
      amount: -price,
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
        })),
        ...giftLineItems,
      ],
      feeLines,
      couponCode: validCoupon?.code,
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
    });
  } catch (err) {
    console.error("Order creation failed", err);
    return NextResponse.json(
      { error: "Could not create your order. Please try again." },
      { status: 500 },
    );
  }

  const chargeResult = await chargeOrderWithSquare(order.id, body.sourceId);
  if ("error" in chargeResult) {
    return NextResponse.json(
      { error: chargeResult.error, orderId: order.id },
      { status: 402 },
    );
  }

  // Only debit the credit ledger once payment has actually succeeded, so a
  // failed or cancelled charge never burns the customer's balance.
  if (creditApplied > 0 && session) {
    try {
      await redeemReferralCredit(session.username, creditApplied);
    } catch (err) {
      console.error("Failed to redeem store credit after successful charge", err);
    }
  }

  return NextResponse.json({
    success: true,
    orderId: order.id,
    orderKey: order.orderKey,
  });
}
