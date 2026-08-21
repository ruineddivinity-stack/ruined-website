export function VipBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-0 rounded-full border border-steel-500/40 bg-surface-2/90 p-0.5 pl-2.5 backdrop-blur-md sm:p-1 sm:pl-4 ${className}`}
    >
      <span className="flex items-center gap-1.5 pr-2 text-[9px] font-bold uppercase tracking-wide text-chrome-100 sm:gap-2 sm:pr-3 sm:text-xs sm:tracking-widest">
        <span className="relative hidden h-2 w-2 sm:flex">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <BellIcon className="h-2.5 w-2.5 sm:h-[13px] sm:w-[13px]" />
        <span className="whitespace-nowrap">VIP Restock Alerts</span>
      </span>
      <span
        className="animate-[gradient-shift_5s_ease-in-out_infinite] whitespace-nowrap rounded-full bg-[length:200%_100%] px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wide text-white shadow-[0_0_18px_2px_rgba(140,82,199,0.55)] sm:px-4 sm:py-2.5 sm:text-[11px] sm:tracking-widest"
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

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
