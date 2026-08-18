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
      wrap: "bg-steel-600 text-white shadow-[0_0_14px_1px_rgba(86,134,172,0.55)]",
      dot: "bg-steel-300",
    },
    chrome: {
      wrap: "bg-chrome-700 text-chrome-100 shadow-[0_0_14px_1px_rgba(139,150,161,0.45)]",
      dot: "bg-chrome-100",
    },
    danger: {
      wrap: "bg-danger text-white shadow-[0_0_14px_1px_rgba(196,84,74,0.65)]",
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
