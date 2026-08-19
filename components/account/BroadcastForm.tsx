"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Result =
  | { type: "success"; sent: number; failed: number; total: number }
  | { type: "error"; message: string };

export function BroadcastForm({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [confirming, setConfirming] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/account/subscribers/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body }),
    });

    const json = await res.json().catch(() => ({}));
    setLoading(false);
    setConfirming(false);

    if (!res.ok) {
      setResult({ type: "error", message: json.error ?? "Send failed." });
      return;
    }

    setResult({
      type: "success",
      sent: json.sent,
      failed: json.failed,
      total: json.total,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Subject
        </span>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setConfirming(false);
          }}
          placeholder="Back in stock: BPC-157"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Message
        </span>
        <textarea
          required
          rows={8}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setConfirming(false);
          }}
          placeholder={"Write the email body here. Blank lines start a new paragraph."}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
        />
      </label>

      {result?.type === "error" && (
        <p className="text-sm text-danger">{result.message}</p>
      )}
      {result?.type === "success" && (
        <p className="text-sm text-steel-400">
          Sent to {result.sent} of {result.total} subscribers
          {result.failed > 0 ? ` (${result.failed} failed)` : ""}.
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full justify-center sm:w-auto">
        {loading
          ? "Sending…"
          : confirming
            ? `Confirm — send to ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`
            : "Send Broadcast"}
      </Button>
      {confirming && !loading && (
        <p className="text-xs text-fg-faint">
          Click again to confirm. This emails everyone on the list right away.
        </p>
      )}
    </form>
  );
}
