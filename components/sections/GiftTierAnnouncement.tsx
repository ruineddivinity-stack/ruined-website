"use client";

import { OPEN_GIFT_TIERS_MODAL_EVENT } from "@/components/layout/GiftTiersModal";

export function GiftTierAnnouncement({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_GIFT_TIERS_MODAL_EVENT))}
      className={`group flex w-full items-center justify-between gap-3 rounded-xl border border-steel-500/30 bg-steel-700/10 px-4 py-3 text-left backdrop-blur-md transition-colors hover:border-steel-400 hover:bg-steel-700/20 sm:rounded-2xl sm:px-5 sm:py-3.5 ${className}`}
    >
      <span className="text-xs font-bold uppercase tracking-wide text-fg sm:text-sm">
        🎁 Unlock Free Gifts &mdash; Save Up To{" "}
        <span className="text-gradient-holo">$75</span>
      </span>

      <span className="shrink-0 rounded-full border border-steel-500/50 bg-steel-700/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-steel-300 transition-colors group-hover:border-steel-400 group-hover:text-steel-200 sm:px-4 sm:py-2 sm:text-xs sm:tracking-widest">
        See Gift Tiers &rarr;
      </span>
    </button>
  );
}
