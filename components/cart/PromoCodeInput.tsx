"use client";

import { useState } from "react";

export function PromoCodeInput({
  applied,
  onApply,
}: {
  applied: boolean;
  onApply: (code: string) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (!value.trim()) return;
    onApply(value);
    setError(value.trim().toUpperCase() !== "RX");
  };

  if (applied) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-steel-600/50 bg-steel-700/20 px-4 py-3 text-sm text-steel-300">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-steel-400" />
        Affiliate code applied — extra 10% off
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
          className="shrink-0 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-steel-500"
        >
          Apply
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-danger">That code isn&rsquo;t valid.</p>
      )}
    </div>
  );
}
