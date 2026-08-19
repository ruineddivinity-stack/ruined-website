"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong. Try again.");
      return;
    }

    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-steel-500/30 bg-surface px-5 py-6 text-center">
        <p className="text-sm font-semibold text-fg">You&rsquo;re on the list.</p>
        <p className="text-xs text-fg-muted">
          We&rsquo;ll email <span className="text-fg">{email}</span> the moment
          there&rsquo;s a restock or new batch drop.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
      />

      {error && <p className="text-xs text-danger">{error}</p>}

      <p className="mt-1 text-xs leading-relaxed text-fg-faint">
        By submitting this form, you consent to receive marketing emails
        (e.g., restock alerts) from RUINED. Unsubscribe at any time via the
        link in any email.{" "}
        <a
          href="/legal/privacy"
          className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
        >
          Privacy Policy
        </a>{" "}
        &amp;{" "}
        <a
          href="/legal/terms"
          className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
        >
          Terms
        </a>
        .
      </p>

      <Button type="submit" disabled={loading} className="mt-2 w-full justify-center">
        {loading ? "Joining…" : "Join Notifications"}
      </Button>
    </form>
  );
}
