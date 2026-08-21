export function VipBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-0 rounded-full border border-steel-500/40 bg-surface-2/90 p-1 pl-4 backdrop-blur-md ${className}`}
    >
      <span className="flex items-center gap-2 pr-3 text-xs font-bold uppercase tracking-widest text-chrome-100">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <BellIcon />
        VIP Restock Alerts
      </span>
      <span
        className="animate-[gradient-shift_5s_ease-in-out_infinite] rounded-full bg-[length:200%_100%] px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-white shadow-[0_0_18px_2px_rgba(140,82,199,0.55)]"
        style={{
          backgroundImage:
            "linear-gradient(110deg, var(--color-holo-violet), var(--color-holo-blue), var(--color-holo-pink))",
        }}
      >
        Get 10% Off Forever
      </span>
    </span>
  );
}

function BellIcon() {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
