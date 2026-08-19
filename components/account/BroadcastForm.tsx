"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Result =
  | { type: "success"; sent: number; failed: number; total: number; test?: boolean }
  | { type: "error"; message: string };

export function BroadcastForm({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState<"test" | "send" | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [confirming, setConfirming] = useState(false);

  const sendTest = async () => {
    setLoading("test");
    setResult(null);
    setConfirming(false);

    const res = await fetch("/api/account/subscribers/send-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body }),
    });

    const json = await res.json().catch(() => ({}));
    setLoading(null);

    if (!res.ok) {
      setResult({ type: "error", message: json.error ?? "Test send failed." });
      return;
    }
    setResult({ type: "success", sent: json.sent, failed: json.failed, total: json.total, test: true });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading("send");
    setResult(null);

    const res = await fetch("/api/account/subscribers/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body }),
    });

    const json = await res.json().catch(() => ({}));
    setLoading(null);
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
          {result.test ? "Test sent to your own email." : `Sent to ${result.sent} of ${result.total} subscribers${result.failed > 0 ? ` (${result.failed} failed)` : ""}.`}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={loading !== null || !subject || !body}
          onClick={sendTest}
          className="justify-center"
        >
          {loading === "test" ? "Sending test…" : "Send Test to Myself"}
        </Button>

        <Button type="submit" disabled={loading !== null} className="justify-center">
          {loading === "send"
            ? "Sending…"
            : confirming
              ? `Confirm — send to ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`
              : "Send Broadcast"}
        </Button>
      </div>
      {confirming && loading === null && (
        <p className="text-xs text-fg-faint">
          Click again to confirm. This emails everyone on the list right away.
        </p>
      )}
    </form>
  );
}
