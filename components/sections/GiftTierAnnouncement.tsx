"use client";

import { GIFT_TIERS } from "@/lib/discounts";
import { OPEN_GIFT_TIERS_MODAL_EVENT } from "@/components/layout/GiftTiersModal";

const sortedTiers = [...GIFT_TIERS].sort((a, b) => a.min - b.min);
const lowestTier = sortedTiers[0];
const bestTier = sortedTiers[sortedTiers.length - 1];

export function GiftTierAnnouncement({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_GIFT_TIERS_MODAL_EVENT))}
      className={`holo-border-static group relative flex w-full flex-col items-center gap-2 overflow-hidden rounded-xl px-3 py-2.5 text-center backdrop-blur-md transition-transform duration-300 hover:scale-[1.01] sm:gap-3 sm:rounded-2xl sm:px-5 sm:py-4 sm:flex-row sm:justify-between sm:text-left ${className}`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="relative hidden shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-steel-400 to-steel-700 text-xl sm:flex sm:h-11 sm:w-11">
          <span
            aria-hidden
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-steel-400 opacity-30"
          />
          <span className="relative">🎁</span>
        </span>
        <p className="text-[11px] font-semibold leading-snug text-fg sm:text-base">
          🎁 Spend <span className="font-black text-gradient-holo">${lowestTier.min}+</span>{" "}
          and unlock free gifts &mdash; up to{" "}
          <span className="font-black text-gradient-holo">{bestTier.label}</span>
        </p>
      </div>

      <span className="shrink-0 rounded-full border border-steel-500/50 bg-steel-700/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-steel-300 transition-colors group-hover:border-steel-400 group-hover:text-steel-200 sm:px-4 sm:py-2 sm:text-xs sm:tracking-widest">
        See Gift Tiers &rarr;
      </span>
    </button>
  );
}
