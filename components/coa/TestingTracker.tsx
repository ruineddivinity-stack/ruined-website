"use client";

import { motion } from "framer-motion";

const ACTIVE_PCT = 50;

const stages = [
  { pct: 0, label: "Sample Collected", status: "done" },
  { pct: ACTIVE_PCT, label: "In Transit to Lab", status: "active" },
  { pct: 100, label: "HPLC Testing", status: "pending" },
] as const;

export function TestingTracker() {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 px-6 pb-8 pt-10 sm:px-10">
      <div className="flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-steel-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-steel-400" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-steel-300">
          Current Batch &mdash; In Transit to Lab
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-md">
        <div className="relative mx-4 h-px sm:mx-6">
          <div className="absolute inset-0 h-px rounded-full bg-border-soft" />
          <div
            className="absolute inset-y-0 left-0 h-px rounded-full bg-gradient-to-r from-steel-600 to-steel-400"
            style={{ width: `${ACTIVE_PCT}%` }}
          />

          <motion.div
            aria-hidden
            className="absolute -top-[13px] -translate-x-1/2 text-steel-300 drop-shadow-[0_0_8px_rgba(31,200,221,0.6)]"
            style={{ left: `${ACTIVE_PCT}%` }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <TruckIcon />
          </motion.div>

          {stages.map((s) => (
            <div
              key={s.label}
              className="absolute top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${s.pct}%` }}
            >
              {s.status === "active" ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-steel-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-steel-300 bg-steel-500" />
                </span>
              ) : (
                <span
                  className={`h-2.5 w-2.5 rounded-full border-2 ${
                    s.status === "done"
                      ? "border-steel-300 bg-steel-400"
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
                  s.status === "pending" ? "text-fg-faint" : "text-fg-muted"
                } ${s.status === "active" ? "text-steel-300" : ""} ${
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

function TruckIcon() {
  return (
    <svg
      width={26}
      height={26}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7.5" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}
