import "server-only";

const WORDPRESS_URL = process.env.WOOCOMMERCE_URL;
const AFFILIATE_DASHBOARD_SECRET = process.env.WP_AFFILIATE_DASHBOARD_SECRET;

export type CouponInfo = {
  couponName: string;
  unpaidCommission: number;
  pendingPayouts: number;
};

async function dashboardAjax<T>(
  action: string,
  params: Record<string, string>,
): Promise<T> {
  if (!WORDPRESS_URL) throw new Error("Missing WOOCOMMERCE_URL env var");
  if (!AFFILIATE_DASHBOARD_SECRET) {
    throw new Error("Missing WP_AFFILIATE_DASHBOARD_SECRET env var");
  }

  const body = new URLSearchParams({
    action,
    secret: AFFILIATE_DASHBOARD_SECRET,
    ...params,
  });

  const res = await fetch(`${WORDPRESS_URL}/wp-admin/admin-ajax.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);
  if (!json?.success) {
    throw new Error(
      `Coupon Affiliates bridge error (${action}): ${json?.data?.message ?? res.status}`,
    );
  }
  return json.data as T;
}

export async function getAffiliateCoupons(
  userLogin: string,
): Promise<number[]> {
  const raw = await dashboardAjax<Array<string | number>>(
    "ruined_affiliate_coupons",
    { username: userLogin },
  );

  if (!Array.isArray(raw)) return [];
  return raw.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
}

export async function getCouponInfo(couponId: number): Promise<CouponInfo> {
  const raw = await dashboardAjax<Record<string, string | number>>(
    "ruined_affiliate_coupon_info",
    { coupon_id: String(couponId) },
  );

  return {
    couponName: String(raw.coupon_name ?? ""),
    unpaidCommission: Number(raw.unpaid_commission ?? 0),
    pendingPayouts: Number(raw.pending_payouts ?? 0),
  };
}

export type BankInfo = {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
};

export async function requestPayout(
  couponId: number,
  userLogin: string,
): Promise<{ success: boolean; bankInfo: BankInfo | null }> {
  const result = await dashboardAjax<{
    success: boolean;
    bankInfo: {
      account_holder: string;
      bank_name: string;
      account_number: string;
      routing_number: string;
      account_type: string;
    } | null;
  }>("ruined_affiliate_request_payout", {
    coupon_id: String(couponId),
    username: userLogin,
  });

  return {
    success: result.success === true,
    bankInfo: result.bankInfo
      ? {
          accountHolder: result.bankInfo.account_holder,
          bankName: result.bankInfo.bank_name,
          accountNumber: result.bankInfo.account_number,
          routingNumber: result.bankInfo.routing_number,
          accountType: result.bankInfo.account_type,
        }
      : null,
  };
}

export async function getAffiliateBankStatus(
  userLogin: string,
): Promise<boolean> {
  const result = await dashboardAjax<{ hasBankInfo: boolean }>(
    "ruined_affiliate_bank_status",
    { username: userLogin },
  );
  return result.hasBankInfo === true;
}

export async function saveAffiliateBankInfo(
  userLogin: string,
  info: BankInfo,
): Promise<boolean> {
  const result = await dashboardAjax<{ saved: boolean }>(
    "ruined_affiliate_save_bank_info",
    {
      username: userLogin,
      account_holder: info.accountHolder,
      bank_name: info.bankName,
      account_number: info.accountNumber,
      routing_number: info.routingNumber,
      account_type: info.accountType,
    },
  );
  return result.saved === true;
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
