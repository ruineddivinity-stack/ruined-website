export function DocumentCard({
  name,
  category,
  href,
}: {
  name: string;
  category: string;
  href: string | null;
}) {
  const available = !!href;

  const card = (
    <div
      className={`flex h-full flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 ${
        available
          ? "border-border bg-surface/60 hover:-translate-y-1 hover:border-steel-500/50 hover:shadow-[0_0_20px_2px_rgba(140,82,199,0.2)]"
          : "border-border-soft bg-surface/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            available
              ? "bg-gradient-to-b from-steel-700/50 to-steel-700/10 text-steel-300"
              : "bg-surface-2 text-fg-faint"
          }`}
        >
          <DocIcon />
        </span>
        {available ? (
          <span className="rounded-full border border-steel-500/40 bg-steel-700/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-steel-300">
            PDF
          </span>
        ) : (
          <span className="rounded-full border border-border-soft bg-surface-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-fg-faint">
            Pending
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-fg">{name}</p>
        <p className="mt-0.5 text-xs text-fg-faint">{category}</p>
      </div>

      <p
        className={`mt-auto text-xs ${available ? "font-semibold text-steel-300" : "text-fg-faint"}`}
      >
        {available ? "View report →" : "Report not yet available"}
      </p>
    </div>
  );

  if (available) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {card}
      </a>
    );
  }

  return card;
}

function DocIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}
