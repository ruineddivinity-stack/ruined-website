"use client";

import { motion } from "framer-motion";

const ACTIVE_PCT = 100;

const stages = [
  { pct: 0, label: "Sample Collected", status: "done" },
  { pct: 50, label: "In Transit to Lab", status: "done" },
  { pct: ACTIVE_PCT, label: "At Freedom Diagnostics", status: "active" },
] as const;

export function TestingTracker() {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 px-6 pb-8 pt-10 sm:px-10">
      <div className="flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
          Current Batch &mdash; Arrived at Freedom Diagnostics, Preparing for Testing
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-md">
        <div className="relative mx-4 h-px sm:mx-6">
          <div className="absolute inset-0 h-px rounded-full bg-border-soft" />
          <div
            className="absolute inset-y-0 left-0 h-px rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
            style={{ width: `${ACTIVE_PCT}%` }}
          />

          <motion.div
            aria-hidden
            className="absolute -top-[13px] -translate-x-1/2 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
            style={{ left: `${ACTIVE_PCT}%` }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <CheckIcon />
          </motion.div>

          {stages.map((s) => (
            <div
              key={s.label}
              className="absolute top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${s.pct}%` }}
            >
              {s.status === "active" ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-emerald-300 bg-emerald-500" />
                </span>
              ) : (
                <span
                  className={`h-2.5 w-2.5 rounded-full border-2 ${
                    s.status === "done"
                      ? "border-emerald-300 bg-emerald-400"
                      : "border-border-soft bg-black"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="relative mx-4 mt-5 h-8 sm:mx-6">
          {stages.map((s, i) => {
            const isFirst = i === 0;
            const isLast = i === stages.length - 1;
            return (
              <span
                key={s.label}
                className={`absolute top-0 max-w-[6rem] text-[10px] font-semibold uppercase leading-tight tracking-wide ${
                  s.status === "active" ? "text-emerald-300" : "text-fg-muted"
                } ${
                  isFirst
                    ? "left-0 text-left"
                    : isLast
                      ? "right-0 text-right"
                      : "left-1/2 -translate-x-1/2 text-center"
                }`}
                style={{ left: isFirst ? 0 : isLast ? "auto" : `${s.pct}%` }}
              >
                {s.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="currentColor" fillOpacity={0.15} />
      <path
        d="m7 12.5 3.2 3.2L17 9"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
