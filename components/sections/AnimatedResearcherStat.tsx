"use client";

import { useEffect, useState } from "react";

const TARGET = 10000;
const DURATION_MS = 1600;

export function AnimatedResearcherStat() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * TARGET));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div>
      <div className="flex gap-0.5 text-steel-300">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="animate-glow-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <p className="mt-1.5 font-display text-lg font-semibold text-fg">
        {count.toLocaleString()}+
      </p>
      <p className="text-[11px] uppercase tracking-widest text-fg-faint">
        Joined the community
      </p>
    </div>
  );
}

function StarIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
    >
      <path d="M12 2.5l2.9 6.2 6.8.6-5.1 4.6 1.5 6.7-6.1-3.6-6.1 3.6 1.5-6.7-5.1-4.6 6.8-.6Z" />
    </svg>
  );
}
