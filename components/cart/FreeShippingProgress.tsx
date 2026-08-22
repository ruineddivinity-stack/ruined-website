import { FREE_SHIPPING_THRESHOLD } from "@/lib/discounts";

export function FreeShippingProgress({
  subtotal,
  forceUnlocked = false,
}: {
  subtotal: number;
  /** True when free shipping is already guaranteed some other way (e.g. a bundle). */
  forceUnlocked?: boolean;
}) {
  const unlocked = forceUnlocked || subtotal >= FREE_SHIPPING_THRESHOLD;
  const pct = unlocked ? 100 : Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div>
      <p className="text-xs font-medium text-fg-muted">
        {unlocked ? (
          <span className="text-steel-300">
            You&rsquo;ve unlocked free shipping!
          </span>
        ) : (
          <>
            You&rsquo;re{" "}
            <span className="font-semibold text-fg">
              ${remaining.toFixed(2)}
            </span>{" "}
            away from free shipping
          </>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-steel-500 to-steel-300 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
