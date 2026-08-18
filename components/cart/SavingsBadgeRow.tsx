export function SavingsBadgeRow() {
  return (
    <div className="flex flex-wrap gap-2">
      <SavingsPill label="3-9 Vials — 8% Off" />
      <SavingsPill label="Kit (10+) — 20% Off" />
    </div>
  );
}

function SavingsPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-steel-600/50 bg-steel-700/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-steel-300">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-steel-400" />
      {label}
    </span>
  );
}
