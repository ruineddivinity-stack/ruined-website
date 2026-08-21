"use client";

import { OPEN_GIFT_TIERS_MODAL_EVENT } from "@/components/layout/GiftTiersModal";

export function GiftButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_GIFT_TIERS_MODAL_EVENT))}
      aria-label="View gift tiers"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:border-steel-500 hover:text-fg"
    >
      <span className="text-base">🎁</span>
    </button>
  );
}
