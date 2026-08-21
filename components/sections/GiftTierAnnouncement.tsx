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
      className={`holo-border-static group relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-2xl px-5 py-4 text-center backdrop-blur-md transition-transform duration-300 hover:scale-[1.01] sm:flex-row sm:justify-between sm:text-left ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-steel-400 to-steel-700 text-xl">
          <span
            aria-hidden
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-steel-400 opacity-30"
          />
          <span className="relative">🎁</span>
        </span>
        <p className="text-sm font-semibold text-fg sm:text-base">
          Spend <span className="font-black text-gradient-holo">${lowestTier.min}+</span>{" "}
          and unlock free gifts &mdash; up to{" "}
          <span className="font-black text-gradient-holo">{bestTier.label}</span>
        </p>
      </div>

      <span className="shrink-0 rounded-full border border-steel-500/50 bg-steel-700/25 px-4 py-2 text-xs font-bold uppercase tracking-widest text-steel-300 transition-colors group-hover:border-steel-400 group-hover:text-steel-200">
        See Gift Tiers &rarr;
      </span>
    </button>
  );
}
