import { SPEND_TIERS } from "@/lib/discounts";

const sortedTiers = [...SPEND_TIERS].sort((a, b) => a.min - b.min);
const maxTier = sortedTiers[sortedTiers.length - 1];

export function SpendDiscountProgress({ subtotal }: { subtotal: number }) {
  const pct = Math.min(100, (subtotal / maxTier.min) * 100);
  const nextTier = sortedTiers.find((t) => subtotal < t.min);
  const highestUnlocked = [...sortedTiers].reverse().find((t) => subtotal >= t.min);

  return (
    <div>
      <p className="text-xs font-medium text-fg-muted">
        {nextTier ? (
          <>
            {highestUnlocked && (
              <span className="text-steel-300">
                ${highestUnlocked.amount} off unlocked —{" "}
              </span>
            )}
            You&rsquo;re{" "}
            <span className="font-semibold text-fg">
              ${(nextTier.min - subtotal).toFixed(2)}
            </span>{" "}
            away from ${nextTier.amount} off
          </>
        ) : (
          <span className="text-steel-300">
            You&rsquo;ve unlocked ${maxTier.amount} off!
          </span>
        )}
      </p>

      <div className="relative mt-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-steel-500 to-steel-300 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {sortedTiers.map((t) => (
          <div
            key={t.min}
            className="absolute top-0 h-1.5 w-px bg-[rgba(3,3,4,0.5)]"
            style={{ left: `${Math.min(100, (t.min / maxTier.min) * 100)}%` }}
          />
        ))}
      </div>

      <div className="relative mt-1.5 h-3 text-[10px] uppercase tracking-wide text-fg-faint">
        {sortedTiers.map((t) => {
          const leftPct = Math.min(100, (t.min / maxTier.min) * 100);
          const unlocked = subtotal >= t.min;
          return (
            <span
              key={t.min}
              className={`absolute top-0 whitespace-nowrap ${unlocked ? "text-steel-300" : ""}`}
              style={{
                left: `${leftPct}%`,
                transform: leftPct >= 100 ? "translateX(-100%)" : "translateX(-50%)",
              }}
            >
              ${t.min}
            </span>
          );
        })}
      </div>
    </div>
  );
}
