"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AffiliateApplicationForm() {
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/account/affiliate/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponCode }),
    });

    const body = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(body.error ?? "Something went wrong. Try again.");
      return;
    }

    setMessage(body.message || "Your application has been submitted.");
  };

  if (message) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-steel-600/50 bg-steel-700/15 px-8 py-12 text-center">
        <span className="h-1.5 w-1.5 rounded-full bg-steel-400" />
        <p className="mt-2 text-sm text-fg">{message}</p>
        <p className="text-xs text-fg-faint">
          We&rsquo;ll email you once it&rsquo;s reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-8">
      <h2 className="font-display text-lg font-black uppercase tracking-wide text-fg">
        Become an Affiliate
      </h2>
      <p className="mt-2 text-sm text-fg-muted">
        Pick a discount code and apply. We&rsquo;ll review your application
        and set you up with a live affiliate dashboard once approved.
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
            Preferred Coupon Code
          </span>
          <input
            type="text"
            required
            minLength={3}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="e.g. YOURNAME10"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
          />
        </label>

        <Button type="submit" disabled={loading} className="justify-center">
          {loading ? "Submitting…" : "Submit Application"}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
