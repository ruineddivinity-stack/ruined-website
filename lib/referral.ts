import "server-only";
import { wpFetch } from "./wp-origin-fetch";

const WORDPRESS_URL = process.env.WOOCOMMERCE_URL;
const REFERRAL_SECRET = process.env.WP_REFERRAL_SECRET;

export type ReferralInfo = {
  code: string;
  balance: number;
  uses: number;
};

async function referralAjax<T>(
  action: string,
  params: Record<string, string>,
): Promise<T> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");
  if (!REFERRAL_SECRET) throw new Error("Missing WP_REFERRAL_SECRET env var");

  const body = new URLSearchParams({
    action,
    secret: REFERRAL_SECRET,
    ...params,
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
    throw new Error(
      `Referral bridge error (${action}): ${json?.data?.message ?? res.status}`,
    );
  }
  return json.data as T;
}

export async function getOrCreateReferral(
  userLogin: string,
): Promise<ReferralInfo> {
  const raw = await referralAjax<{
    code: string;
    balance: number | string;
    uses: number | string;
  }>("ruined_referral_get_or_create", { username: userLogin });

  return {
    code: raw.code,
    balance: Number(raw.balance) || 0,
    uses: Number(raw.uses) || 0,
  };
}

export async function getReferralBalance(userLogin: string): Promise<number> {
  const raw = await referralAjax<{ balance: number | string }>(
    "ruined_referral_balance",
    { username: userLogin },
  );
  return Number(raw.balance) || 0;
}

export async function redeemReferralCredit(
  userLogin: string,
  amount: number,
): Promise<number> {
  const raw = await referralAjax<{ balance: number | string }>(
    "ruined_referral_redeem_credit",
    { username: userLogin, amount: amount.toFixed(2) },
  );
  return Number(raw.balance) || 0;
}
