import Link from "next/link";

export function HeroBundleBanner() {
  return (
    <Link
      href="/bundle"
      className="holo-border-live group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-transform duration-300 hover:scale-[1.01] sm:rounded-2xl sm:px-5 sm:py-3.5"
    >
      <span className="text-xs font-black uppercase tracking-wide text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:text-sm">
        🔥 Build A Bundle, Get 25% Off
      </span>

      <span className="shrink-0 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-white transition-colors group-hover:border-white/60 sm:px-4 sm:py-2 sm:text-xs sm:tracking-widest">
        Build Yours &rarr;
      </span>
    </Link>
  );
}
