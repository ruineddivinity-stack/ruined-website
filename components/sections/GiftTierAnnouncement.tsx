"use client";

import { GIFT_TIERS } from "@/lib/discounts";
import { OPEN_SAVINGS_MODAL_EVENT } from "@/components/layout/SavingsModal";

const sortedTiers = [...GIFT_TIERS].sort((a, b) => a.min - b.min);
const lowestTier = sortedTiers[0];
const bestTier = sortedTiers[sortedTiers.length - 1];

export function GiftTierAnnouncement({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SAVINGS_MODAL_EVENT))}
      className={`flex w-fit items-center gap-2.5 rounded-full border border-steel-500/30 bg-steel-700/15 px-4 py-2.5 text-left text-xs font-semibold text-fg-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-steel-500 ${className}`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-steel-700/50 to-steel-700/10 text-steel-300">
        <GiftIcon />
      </span>
      <span>
        Spend <span className="font-bold text-fg">${lowestTier.min}+</span>{" "}
        and unlock free gifts &mdash; up to{" "}
        <span className="font-bold text-gradient-holo">{bestTier.label}</span>
      </span>
    </button>
  );
}

function GiftIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M4 13h16M12 9v11" />
      <path d="M12 9c-1.8 0-3.2-1.2-3.2-2.8S9.2 3.5 10.5 3.5c1.6 0 2.5 2.2 2.5 2.2" />
      <path d="M12 9c1.8 0 3.2-1.2 3.2-2.8S13.8 3.5 12.5 3.5c-1.6 0-2.5 2.2-2.5 2.2" />
    </svg>
  );
}
