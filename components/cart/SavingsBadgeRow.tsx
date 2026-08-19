import { BULK_TIERS, STACKED_SAVINGS_PCT } from "@/lib/discounts";

export function SavingsBadgeRow() {
  return (
    <div className="flex flex-wrap gap-2">
      <SavingsPill
        label={BULK_TIERS.bulk.label}
        pct={STACKED_SAVINGS_PCT.bulk}
      />
      <SavingsPill
        label={BULK_TIERS.kit.label}
        pct={STACKED_SAVINGS_PCT.kit}
      />
    </div>
  );
}

function SavingsPill({ label, pct }: { label: string; pct: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-steel-600/50 bg-steel-700/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-steel-300">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-steel-400" />
      {label} &mdash; Up to {pct}%
    </span>
  );
}
