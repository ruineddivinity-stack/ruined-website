import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { POST as createLegacyOrder } from "@/app/api/checkout/route";
import { getOrder } from "@/lib/woocommerce";
import { wpFetch } from "@/lib/wp-origin-fetch";

type CheckoutV2Body = Record<string, unknown> & {
  paymentMethod?: "card" | "cashapp";
};

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;
const SISTER_CHECKOUT_URL = process.env.SISTER_CHECKOUT_URL;
const BRIDGE_SHARED_SECRET = process.env.BRIDGE_SHARED_SECRET;
const PRIMARY_CHECKOUT_RETURN_ORIGIN = process.env.PRIMARY_CHECKOUT_RETURN_ORIGIN;

function authHeader() {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error(
      "Missing WOOCOMMERCE_CONSUMER_KEY / WOOCOMMERCE_CONSUMER_SECRET env vars",
    );
  }

  return `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`;
}

async function updateOrderForCard(orderId: number, paymentRef: string) {
  if (!WOOCOMMERCE_URL) {
    throw new Error("Missing WOOCOMMERCE_URL env var");
  }

  const response = await wpFetch(
    `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}`,
    {
      method: "PUT",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_method: "sister_checkout_handoff",
        payment_method_title: "Credit / Debit Card",
        status: "pending",
        meta_data: [
          {
            key: "_sister_payment_ref",
            value: paymentRef,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Could not prepare card order: ${response.status} ${text}`);
  }
}

function buildPrimaryReturnUrl(request: Request, orderId: number, orderKey: string) {
  const requestOrigin = new URL(request.url).origin;
  const origin = (PRIMARY_CHECKOUT_RETURN_ORIGIN || requestOrigin).replace(/\/$/, "");
  return `${origin}/order-confirmation/${orderId}?key=${encodeURIComponent(orderKey)}`;
}

function buildSignedHandoff({
  request,
  orderId,
  orderKey,
  amount,
  currency,
  paymentRef,
}: {
  request: Request;
  orderId: number;
  orderKey: string;
  amount: number;
  currency: string;
  paymentRef: string;
}) {
  if (!SISTER_CHECKOUT_URL || !BRIDGE_SHARED_SECRET) {
    throw new Error("Sister checkout is not configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    v: 2,
    payment_ref: paymentRef,
    amount: Math.round(amount * 100),
    currency: currency.toUpperCase(),
    items: [],
    issued_at: now,
    expires_at: now + 300,
    primary_return_url: buildPrimaryReturnUrl(request, orderId, orderKey),
    order_id: orderId,
    order_key: orderKey,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", BRIDGE_SHARED_SECRET)
    .update(payloadB64)
    .digest("hex");

  const sisterBase = SISTER_CHECKOUT_URL.replace(/\/$/, "");
  const handoffUrl = new URL(`${sisterBase}/wp-json/sister-checkout/v1/start`);
  handoffUrl.searchParams.set("payload", payloadB64);
  handoffUrl.searchParams.set("sig", signature);

  return handoffUrl.toString();
}

export async function POST(request: Request) {
  let body: CheckoutV2Body;

  try {
    body = (await request.json()) as CheckoutV2Body;
  } catch {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const paymentMethod = body.paymentMethod === "cashapp" ? "cashapp" : "card";

  if (paymentMethod === "card" && (!SISTER_CHECKOUT_URL || !BRIDGE_SHARED_SECRET)) {
    return NextResponse.json(
      { error: "Card checkout is temporarily unavailable." },
      { status: 503 },
    );
  }

  const forwardedHeaders = new Headers({ "Content-Type": "application/json" });
  const cookie = request.headers.get("cookie");
  if (cookie) forwardedHeaders.set("cookie", cookie);

  const legacyRequest = new Request(new URL("/api/checkout", request.url), {
    method: "POST",
    headers: forwardedHeaders,
    body: JSON.stringify(body),
  });

  const legacyResponse = await createLegacyOrder(legacyRequest);

  if (!legacyResponse.ok) {
    return legacyResponse;
  }

  const result = (await legacyResponse.json()) as {
    success?: boolean;
    orderId?: number;
    orderKey?: string;
    error?: string;
  };

  if (!result.success || !result.orderId || !result.orderKey) {
    return NextResponse.json(
      { error: result.error || "Could not create your order." },
      { status: 500 },
    );
  }

  if (paymentMethod === "cashapp") {
    return NextResponse.json(result);
  }

  const order = await getOrder(result.orderId);
  if (!order || order.orderKey !== result.orderKey) {
    return NextResponse.json(
      { error: "Could not prepare secure card checkout." },
      { status: 500 },
    );
  }

  const paymentRef = randomUUID();

  try {
    await updateOrderForCard(order.id, paymentRef);

    const handoffUrl = buildSignedHandoff({
      request,
      orderId: order.id,
      orderKey: order.orderKey,
      amount: order.total,
      currency: order.currency,
      paymentRef,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderKey: order.orderKey,
      handoffUrl,
    });
  } catch (error) {
    console.error("Failed to initialize sister-site card checkout", error);
    return NextResponse.json(
      { error: "Could not initialize secure card checkout. Please try again." },
      { status: 502 },
    );
  }
}
