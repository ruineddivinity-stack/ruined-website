import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Account | RUINED",
};

export default function AccountOverviewPage() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Link
        href="/account/orders"
        className="rounded-2xl border border-border bg-surface/60 p-6 transition-all hover:-translate-y-1 hover:border-steel-500 hover:shadow-[0_0_24px_2px_rgba(31,200,221,0.25)]"
      >
        <h2 className="font-display text-lg font-black uppercase tracking-wide text-fg">
          Order History
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          View past orders, statuses, and totals.
        </p>
      </Link>

      <Link
        href="/account/affiliate"
        className="rounded-2xl border border-border bg-surface/60 p-6 transition-all hover:-translate-y-1 hover:border-steel-500 hover:shadow-[0_0_24px_2px_rgba(31,200,221,0.25)]"
      >
        <h2 className="font-display text-lg font-black uppercase tracking-wide text-fg">
          Affiliate Dashboard
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          Track commission, payouts, and your discount code.
        </p>
      </Link>
    </div>
  );
}
