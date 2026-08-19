"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong. Try again.");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-steel-500/30 bg-surface px-6 py-10 text-center">
        <p className="text-sm font-semibold text-fg">Message sent.</p>
        <p className="text-xs text-fg-muted">
          Thanks for reaching out — a real person will reply to{" "}
          <span className="text-fg">{email}</span> within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          placeholder="Jane Researcher"
          value={name}
          onChange={setName}
        />
        <Field
          label="Email"
          type="email"
          placeholder="you@lab.com"
          value={email}
          onChange={setEmail}
        />
      </div>
      <Field
        label="Subject"
        placeholder="Question about an order"
        value={subject}
        onChange={setSubject}
      />
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Message
        </span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
        />
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" disabled={loading} className="w-fit">
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
      />
    </label>
  );
}
