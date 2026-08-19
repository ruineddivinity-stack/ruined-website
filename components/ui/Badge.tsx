import { type ReactNode } from "react";

export function Badge({
  children,
  tone = "steel",
}: {
  children: ReactNode;
  tone?: "steel" | "chrome" | "danger";
}) {
  const tones = {
    steel: {
      wrap: "border border-steel-400/40 bg-steel-600/30 text-white shadow-[0_0_14px_1px_rgba(31,200,221,0.45)] backdrop-blur-md",
      dot: "bg-steel-300",
    },
    chrome: {
      wrap: "border border-chrome-300/30 bg-chrome-700/30 text-chrome-100 shadow-[0_0_14px_1px_rgba(146,150,168,0.35)] backdrop-blur-md",
      dot: "bg-chrome-100",
    },
    danger: {
      wrap: "border border-danger/50 bg-danger/35 text-white shadow-[0_0_14px_1px_rgba(196,84,74,0.5)] backdrop-blur-md",
      dot: "bg-white",
    },
  } as const;

  const t = tones[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${t.wrap}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${t.dot} ${
          tone === "danger" ? "animate-pulse" : ""
        }`}
      />
      {children}
    </span>
  );
}
