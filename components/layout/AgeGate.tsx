"use client";

import { useEffect, useState } from "react";
import { AGE_GATE_COOKIE, AGE_GATE_COOKIE_DAYS } from "@/lib/age-gate";

export function AgeGate({ initiallyOpen }: { initiallyOpen: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [age, setAge] = useState(false);
  const [researcher, setResearcher] = useState(false);
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const canEnter = age && researcher && terms;

  const enter = () => {
    if (!canEnter) return;
    const expires = new Date(
      Date.now() + AGE_GATE_COOKIE_DAYS * 24 * 60 * 60 * 1000,
    ).toUTCString();
    document.cookie = `${AGE_GATE_COOKIE}=1; expires=${expires}; path=/; SameSite=Lax`;
    setOpen(false);
  };

  const exit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(3,3,4,0.92)] p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-steel-500/30 bg-surface-2 shadow-[0_0_60px_-10px_rgba(31,200,221,0.4)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full opacity-40 blur-[80px]"
          style={{
            background:
              "conic-gradient(from 180deg, var(--color-holo-violet), var(--color-holo-blue), var(--color-holo-pink), var(--color-holo-gold), var(--color-holo-violet))",
          }}
        />

        <div className="relative p-6 sm:p-8">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-steel-500/40 bg-steel-700/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-steel-300">
              <ShieldIcon />
              VERIFICATION REQUIRED
            </span>
          </div>

          <h2 className="mt-5 text-center font-display text-2xl font-black uppercase tracking-tight text-gradient-holo sm:text-3xl">
            Before You Enter
          </h2>
          <p className="mt-2 text-center text-xs leading-relaxed text-fg-muted">
            RUINED sells research compounds for laboratory use only. Please
            confirm the following to continue.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <GateCheckbox checked={age} onChange={setAge}>
              I am 21 years of age or older.
            </GateCheckbox>
            <GateCheckbox checked={researcher} onChange={setResearcher}>
              I am a verified researcher, or purchasing on behalf of a
              laboratory or research institution.
            </GateCheckbox>
            <GateCheckbox checked={terms} onChange={setTerms}>
              I understand these products are for research use only &mdash;
              not for human or animal consumption.
            </GateCheckbox>
          </div>

          <button
            type="button"
            disabled={!canEnter}
            onClick={enter}
            className="btn-shimmer mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_0_1px_rgba(241,242,247,0.10)] transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_0_24px_4px_rgba(203,206,218,0.45)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Enter Site
          </button>

          <button
            type="button"
            onClick={exit}
            className="mt-3 w-full text-center text-xs text-fg-faint transition-colors hover:text-fg-muted"
          >
            I do not meet these requirements
          </button>
        </div>
      </div>
    </div>
  );
}

function GateCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface/60 p-3.5 transition-colors hover:border-steel-500/50">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
          checked
            ? "border-steel-400 bg-gradient-to-b from-steel-400 to-steel-600"
            : "border-border-soft bg-surface-2"
        }`}
      >
        {checked && <CheckIcon />}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-xs leading-relaxed text-fg-muted">
        {children}
      </span>
    </label>
  );
}

function ShieldIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
