import { NextResponse } from "next/server";
import { getOrder } from "@/lib/woocommerce";
import { wpFetch } from "@/lib/wp-origin-fetch";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;
const BRIDGE_SHARED_SECRET = process.env.BRIDGE_SHARED_SECRET;

function authHeader() {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error(
      "Missing WOOCOMMERCE_CONSUMER_KEY / WOOCOMMERCE_CONSUMER_SECRET env vars",
    );
  }

  return `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`;
}

export async function POST(request: Request) {
  if (!BRIDGE_SHARED_SECRET) {
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });
  }

  let body: {
    bridge_secret?: string;
    order_id?: string | number;
    order_key?: string;
    payment_ref?: string;
    status?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.bridge_secret !== BRIDGE_SHARED_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const orderId = Number(body.order_id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return NextResponse.json({ ok: false, error: "Invalid order" }, { status: 400 });
  }

  const order = await getOrder(orderId);
  if (!order || order.orderKey !== body.order_key) {
    return NextResponse.json({ ok: false, error: "Invalid order" }, { status: 404 });
  }

  if (!WOOCOMMERCE_URL) {
    return NextResponse.json({ ok: false, error: "WooCommerce not configured" }, { status: 503 });
  }

  const rawOrder = await wpFetch(`${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}`, {
    headers: { Authorization: authHeader() },
  });

  if (!rawOrder.ok) {
    return NextResponse.json({ ok: false, error: "Unable to verify order" }, { status: 502 });
  }

  const raw = (await rawOrder.json()) as {
    status?: string;
    meta_data?: { key?: string; value?: unknown }[];
  };

  const storedRef = raw.meta_data?.find((m) => m.key === "_sister_payment_ref")?.value;
  if (!storedRef || String(storedRef) !== String(body.payment_ref || "")) {
    return NextResponse.json(
      { ok: false, error: "Invalid payment reference" },
      { status: 409 },
    );
  }

  if (body.status !== "paid") {
    return NextResponse.json({ ok: false, error: "Unsupported status" }, { status: 400 });
  }

  if (raw.status === "processing" || raw.status === "completed") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  const update = await wpFetch(`${WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${orderId}`, {
    method: "PUT",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      set_paid: true,
      status: "processing",
    }),
  });

  if (!update.ok) {
    const text = await update.text().catch(() => "");
    console.error("Failed to mark WooCommerce order paid", update.status, text);
    return NextResponse.json({ ok: false, error: "Payment sync failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
