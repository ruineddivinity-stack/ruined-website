import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getOrCreateReferral } from "@/lib/referral";
import { CopyReferralLink } from "@/components/account/CopyReferralLink";

export const metadata: Metadata = {
  title: "Referrals | RUINED",
};

export default async function ReferralsPage() {
  const session = await getSession();
  if (!session) return null;

  const referral = await getOrCreateReferral(session.username);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ruinedrx.com";
  const referralLink = `${siteUrl}/?ref=${referral.code}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <h1 className="font-display text-xl font-black uppercase tracking-wide text-fg">
          Refer a Friend
        </h1>
        <p className="mt-2 max-w-xl text-sm text-fg-muted">
          Share your personal link. When a friend orders through it, they
          save 10% and $10 in store credit lands in your account
          automatically &mdash; no application, no waiting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryCard label="Store Credit" value={`$${referral.balance.toFixed(2)}`} />
        <SummaryCard label="Friends Referred" value={referral.uses.toString()} />
      </div>

      <div className="rounded-2xl border border-border bg-surface/60 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-faint">
          Your Referral Link
        </p>
        <p className="mt-1 font-display text-lg font-black tracking-widest text-gradient-holo">
          Code {referral.code}
        </p>
        <div className="mt-4">
          <CopyReferralLink link={referralLink} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-fg-muted">
          Store credit is applied automatically at checkout on your next
          order &mdash; up to the value of your cart.
        </p>
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
