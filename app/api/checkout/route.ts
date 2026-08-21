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
  items: { slug: string; qty: number; variationId?: number }[];
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
  const lines = resolveCartLines(body.items, products).filter((l) => l.qty > 0);

  if (lines.length === 0) {
    return NextResponse.json(
      { error: "None of the items in your cart are available anymore." },
      { status: 400 },
    );
  }

  for (const line of lines) {
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
    lines.map((l) => ({
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

  // Free-gift tiers: inject the real product as a line item (so fulfillment sees
  // it) with an offsetting fee line so it doesn't add to the charge. Skip any
  // item that's out of stock rather than failing checkout over a missing gift.
  const giftTier = getGiftTier(discounts.subtotal);
  const giftLineItems: {
    productId: number;
    quantity: number;
    variationId?: number;
    metaData: { key: string; value: string }[];
  }[] = [];
  if (giftTier) {
    for (const item of giftTier.items) {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) continue;
      const variation = item.variationLabel
        ? (product.variations?.find((v) => v.label === item.variationLabel) ?? null)
        : null;
      if (item.variationLabel && !variation) continue;
      const inStock = variation ? variation.inStock : product.inStock;
      if (!inStock) continue;
      const price = variation ? variation.price : product.price;
      giftLineItems.push({
        productId: product.id,
        quantity: 1,
        variationId: variation?.id,
        // Shows directly under the item in the WooCommerce order/packing-slip
        // view, so fulfillment can tell at a glance this wasn't paid for.
        metaData: [{ key: "🎁 Free Gift", value: `Unlocked at $${giftTier.min}+ spend` }],
      });
      feeLines.push({
        name: `Free gift: ${product.name}${variation ? ` (${variation.label})` : ""}`,
        amount: -price,
      });
    }
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
        ...lines.map((l) => ({
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
