import "server-only";
import { wpFetch } from "./wp-origin-fetch";

const WORDPRESS_URL = process.env.WOOCOMMERCE_URL;
const CHARGE_SECRET = process.env.WP_SQUARE_CHARGE_SECRET;

export async function chargeOrderWithSquare(
  orderId: number,
  sourceId: string,
): Promise<{ ok: true } | { error: string }> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");
  if (!CHARGE_SECRET) throw new Error("Missing WP_SQUARE_CHARGE_SECRET env var");

  const body = new URLSearchParams({
    action: "ruined_square_charge",
    secret: CHARGE_SECRET,
    order_id: String(orderId),
    source_id: sourceId,
    environment: process.env.NEXT_PUBLIC_SQUARE_ENV === "production" ? "production" : "sandbox",
  });

  const res = await wpFetch(`${WORDPRESS_URL}/wp-admin/admin-ajax.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const json = (await res.json().catch(() => null)) as {
    success?: boolean;
    data?: { message?: string };
  } | null;
  if (!json?.success) {
    return {
      error: json?.data?.message ?? "Payment failed. Please try again.",
    };
  }
  return { ok: true };
}

/**
 * Asks the "Ruined Square Bridge" WooCommerce payment gateway (via a
 * WordPress-side admin-ajax trigger) to create a Square-hosted checkout link
 * for an already-created order. That gateway's process_payment() is a
 * standard WooCommerce payment-gateway method, normally only ever invoked by
 * WooCommerce's own checkout flow — this reaches it for an order created
 * headlessly via the REST API instead. See mu-plugins/ruined-square-bridge*
 * on the WordPress side.
 */
export async function createSquareBridgeCheckout(
  orderId: number,
): Promise<{ checkoutUrl: string } | { error: string }> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");
  if (!CHARGE_SECRET) throw new Error("Missing WP_SQUARE_CHARGE_SECRET env var");

  const body = new URLSearchParams({
    action: "ruined_square_bridge_trigger",
    secret: CHARGE_SECRET,
    order_id: String(orderId),
  });

  const res = await wpFetch(`${WORDPRESS_URL}/wp-admin/admin-ajax.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const json = (await res.json().catch(() => null)) as {
    success?: boolean;
    data?: { message?: string; checkoutUrl?: string };
  } | null;

  if (!json?.success || !json.data?.checkoutUrl) {
    return {
      error: json?.data?.message ?? "Could not start secure checkout. Please try again.",
    };
  }
  return { checkoutUrl: json.data.checkoutUrl };
}
