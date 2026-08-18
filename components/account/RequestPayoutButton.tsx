"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RequestPayoutButton({ couponId }: { couponId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/account/affiliate/payout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponId }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      return;
    }

    setDone(true);
    router.refresh();
  };

  if (done) {
    return (
      <span className="text-xs font-semibold uppercase tracking-widest text-steel-300">
        Payout requested
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="rounded-full border border-steel-500/40 bg-steel-700/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-steel-300 transition-colors hover:border-steel-500 hover:bg-steel-700/30 disabled:opacity-50"
      >
        {loading ? "Requesting…" : "Request Payout"}
      </button>
      {error && <p className="text-[11px] text-danger">{error}</p>}
    </div>
  );
}
