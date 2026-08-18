import "server-only";
import { loginWithPassword } from "./wp-auth";

const WORDPRESS_URL = process.env.WOOCOMMERCE_URL;
const WP_ADMIN_EMAIL = process.env.WP_ADMIN_EMAIL;
const WP_ADMIN_PASSWORD = process.env.WP_ADMIN_PASSWORD;

export type CouponInfo = {
  couponName: string;
  unpaidCommission: number;
  pendingPayouts: number;
};

let cachedAdminJwt: { token: string; fetchedAt: number } | null = null;
const ADMIN_JWT_TTL_MS = 10 * 60 * 1000;

async function getAdminJwt(forceFresh = false): Promise<string> {
  if (!WP_ADMIN_EMAIL || !WP_ADMIN_PASSWORD) {
    throw new Error("Missing WP_ADMIN_EMAIL / WP_ADMIN_PASSWORD env vars");
  }

  if (
    !forceFresh &&
    cachedAdminJwt &&
    Date.now() - cachedAdminJwt.fetchedAt < ADMIN_JWT_TTL_MS
  ) {
    return cachedAdminJwt.token;
  }

  const result = await loginWithPassword(WP_ADMIN_EMAIL, WP_ADMIN_PASSWORD);
  if ("error" in result) {
    throw new Error(`Admin JWT login failed: ${result.error}`);
  }

  cachedAdminJwt = { token: result.jwt, fetchedAt: Date.now() };
  return result.jwt;
}

async function affiliateFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");

  const attempt = async (jwt: string) =>
    fetch(`${WORDPRESS_URL}/wp-json/woo-coupon-usage/v1/${path}`, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    });

  let res = await attempt(await getAdminJwt());
  if (res.status === 401 || res.status === 403) {
    // Admin JWT may have expired — retry once with a fresh one.
    res = await attempt(await getAdminJwt(true));
  }

  if (!res.ok) {
    throw new Error(`Coupon Affiliates API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function getAffiliateCoupons(
  userLogin: string,
): Promise<number[]> {
  const raw = await affiliateFetch<Array<string | number>>(
    `users-coupons?user=${encodeURIComponent(userLogin)}`,
  );

  if (!Array.isArray(raw)) return [];
  return raw.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
}

export async function getCouponInfo(couponId: number): Promise<CouponInfo> {
  const raw = await affiliateFetch<Record<string, string | number>>(
    `coupon-info?coupon_id=${couponId}`,
  );

  return {
    couponName: String(raw.coupon_name ?? ""),
    unpaidCommission: Number(raw.unpaid_commission ?? 0),
    pendingPayouts: Number(raw.pending_payouts ?? 0),
  };
}

export async function requestPayout(
  couponId: number,
  userLogin: string,
): Promise<boolean> {
  const result = await affiliateFetch<number | { success: boolean }>(
    "request-payout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coupon_id: couponId, user: userLogin }),
    },
  );
  return result === 1 || (typeof result === "object" && result.success === true);
}

const AFFILIATE_APPLY_SECRET = process.env.WP_AFFILIATE_APPLY_SECRET;

export async function submitAffiliateApplication(data: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  couponCode: string;
}): Promise<
  { ok: true; message: string; autoAccepted: boolean } | { error: string }
> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");
  if (!AFFILIATE_APPLY_SECRET) {
    throw new Error("Missing WP_AFFILIATE_APPLY_SECRET env var");
  }

  const body = new URLSearchParams({
    action: "ruined_affiliate_apply",
    secret: AFFILIATE_APPLY_SECRET,
    username: data.username,
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    coupon_code: data.couponCode,
  });

  const res = await fetch(`${WORDPRESS_URL}/wp-admin/admin-ajax.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);
  if (!json?.success) {
    return {
      error: json?.data?.message ?? "Unable to submit your application.",
    };
  }

  return {
    ok: true,
    message: json.data?.message ?? "Your application has been submitted.",
    autoAccepted: Boolean(json.data?.autoAccepted),
  };
}
