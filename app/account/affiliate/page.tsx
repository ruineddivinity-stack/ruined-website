import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getAffiliateCoupons, getCouponInfo } from "@/lib/affiliate";
import { getCouponById } from "@/lib/woocommerce";
import { RequestPayoutButton } from "@/components/account/RequestPayoutButton";
import { AffiliateApplicationForm } from "@/components/account/AffiliateApplicationForm";

export const metadata: Metadata = {
  title: "Affiliate Dashboard | RUINED",
};

export default async function AffiliateDashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const couponIds = await getAffiliateCoupons(session.username);

  if (couponIds.length === 0) {
    return <AffiliateApplicationForm />;
  }

  const coupons = await Promise.all(
    couponIds.map(async (couponId) => {
      const [info, details] = await Promise.all([
        getCouponInfo(couponId),
        getCouponById(couponId),
      ]);
      return { couponId, info, details };
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Unpaid Commission"
          value={`$${coupons
            .reduce((sum, c) => sum + c.info.unpaidCommission, 0)
            .toFixed(2)}`}
        />
        <SummaryCard
          label="Pending Payouts"
          value={`$${coupons
            .reduce((sum, c) => sum + c.info.pendingPayouts, 0)
            .toFixed(2)}`}
        />
        <SummaryCard
          label="Total Uses"
          value={coupons
            .reduce((sum, c) => sum + (c.details?.usageCount ?? 0), 0)
            .toString()}
        />
      </div>

      <div className="flex flex-col gap-4">
        {coupons.map(({ couponId, info, details }) => (
          <div
            key={couponId}
            className="rounded-2xl border border-border bg-surface/60 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-faint">
                  Your Discount Code
                </p>
                <p className="mt-1 font-display text-xl font-black tracking-widest text-gradient-blue">
                  {details?.code?.toUpperCase() ?? info.couponName}
                </p>
                <p className="mt-1 text-xs text-fg-muted">
                  {details
                    ? details.discountType === "percent"
                      ? `${details.amount}% off for customers who use it`
                      : `$${details.amount.toFixed(2)} off for customers who use it`
                    : ""}
                </p>
              </div>
              <RequestPayoutButton couponId={couponId} />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border-soft pt-4 text-center">
              <Stat label="Times Used" value={details?.usageCount ?? 0} />
              <Stat
                label="Unpaid"
                value={`$${info.unpaidCommission.toFixed(2)}`}
              />
              <Stat
                label="Pending"
                value={`$${info.pendingPayouts.toFixed(2)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-5 text-center">
      <p className="font-display text-2xl font-black text-fg">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-widest text-fg-faint">
        {label}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm font-semibold text-fg">{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-widest text-fg-faint">
        {label}
      </p>
    </div>
  );
}
