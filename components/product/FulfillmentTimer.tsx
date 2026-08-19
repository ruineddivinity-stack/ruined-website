"use client";

import { useEffect, useState } from "react";

const CUTOFF_HOUR = 14; // 2:00 PM
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type CTNow = {
  weekday: number; // 0 = Sunday
  secondsSinceMidnight: number;
};

function getCTNow(): CTNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const hour = Number(map.hour) % 24;
  const minute = Number(map.minute);
  const second = Number(map.second);

  return {
    weekday: weekdayMap[map.weekday],
    secondsSinceMidnight: hour * 3600 + minute * 60 + second,
  };
}

function nextBusinessDay(weekday: number): string {
  let next = (weekday + 1) % 7;
  while (next === 0 || next === 6) next = (next + 1) % 7;
  return DAY_NAMES[next];
}

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function FulfillmentTimer() {
  const [now, setNow] = useState<CTNow | null>(null);

  useEffect(() => {
    setNow(getCTNow());
    const id = setInterval(() => setNow(getCTNow()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const isWeekend = now.weekday === 0 || now.weekday === 6;
  const cutoffSeconds = CUTOFF_HOUR * 3600;
  const secondsUntilCutoff = cutoffSeconds - now.secondsSinceMidnight;
  const isOpen = !isWeekend && secondsUntilCutoff > 0;
  const nextDay = nextBusinessDay(now.weekday);

  return (
    <div
      className={`rounded-2xl border px-5 py-4 transition-colors duration-300 ${
        isOpen
          ? "border-steel-500/40 bg-steel-700/15"
          : "border-border bg-surface/60"
      }`}
    >
      <div className="flex items-center gap-2">
        {isOpen ? (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-steel-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-steel-400" />
          </span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-fg-faint" />
        )}
        <p
          className={`text-[11px] font-semibold uppercase tracking-widest ${
            isOpen ? "text-steel-300" : "text-fg-faint"
          }`}
        >
          Fulfillment Queue
        </p>
      </div>

      {isOpen ? (
        <>
          <p className="mt-2 font-display text-sm font-black uppercase tracking-wide text-fg">
            Order now for same-day processing
          </p>
          <p className="mt-1 font-display text-lg font-black tabular-nums text-gradient-holo">
            {formatCountdown(secondsUntilCutoff)}
          </p>
          <p className="mt-0.5 text-[11px] text-fg-faint">
            Until the 2:00pm CT cutoff for same-day dispatch
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 font-display text-sm font-black uppercase tracking-wide text-fg">
            Fulfillment window closed
          </p>
          <p className="mt-1 text-xs text-fg-muted">
            {isWeekend
              ? `Closed for the weekend. Orders placed now ship ${nextDay}.`
              : `Today's 2:00pm CT cutoff has passed. Orders placed now ship ${nextDay}.`}
          </p>
        </>
      )}
    </div>
  );
}
