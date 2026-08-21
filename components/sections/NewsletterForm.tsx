"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SUBSCRIBED_STORAGE_KEY } from "@/components/layout/WelcomePopup";

const perks = [
  "Restock alerts, the instant a batch is back",
  "Early access to new compound drops",
  "Subscriber-only bulk & kit deals",
];

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

    try {
      window.localStorage.setItem(SUBSCRIBED_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-steel-500/30 bg-surface px-6 py-8 text-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-steel-700/30 text-steel-300">
          <CheckIcon />
        </span>
        <div>
          <p className="text-sm font-semibold text-fg">You&rsquo;re on the list.</p>
          <p className="mt-1 font-display text-xl font-black uppercase tracking-tight text-gradient-holo">
            VIP &mdash; 10% Off Forever
          </p>
        </div>
        <p className="text-xs text-fg-muted">
          We&rsquo;ll email <span className="text-fg">{email}</span> your
          lifetime code, plus you&rsquo;re now locked in for:
        </p>
        <ul className="flex w-full flex-col gap-2 text-left text-xs text-fg-muted">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-steel-400" />
              {perk}
            </li>
          ))}
        </ul>
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

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
