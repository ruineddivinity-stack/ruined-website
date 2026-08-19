"use client";

import { useState } from "react";
import type { AppliedCoupon } from "@/lib/discounts";

export function PromoCodeInput({
  applied,
  onApply,
}: {
  applied: boolean;
  onApply: (coupon: AppliedCoupon | null) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const submit = async () => {
    if (!value.trim() || checking) return;
    setChecking(true);
    setError(false);

    try {
      const res = await fetch("/api/discounts/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value.trim() }),
      });
      const data = await res.json().catch(() => ({ valid: false }));

      if (data.valid) {
        onApply({
          code: data.code,
          discountType: data.discountType,
          amount: data.amount,
        });
      } else {
        onApply(null);
        setError(true);
      }
    } catch {
      onApply(null);
      setError(true);
    } finally {
      setChecking(false);
    }
  };

  if (applied) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-steel-600/50 bg-steel-700/20 px-4 py-3 text-sm text-steel-300">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-steel-400" />
        Affiliate code applied
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Affiliate code"
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={checking}
          className="shrink-0 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-steel-500 disabled:opacity-60"
        >
          {checking ? "Checking…" : "Apply"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-danger">That code isn&rsquo;t valid.</p>
      )}
    </div>
  );
}
