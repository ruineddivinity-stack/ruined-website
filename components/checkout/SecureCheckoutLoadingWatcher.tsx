"use client";

import { useEffect, useState } from "react";

export function SecureCheckoutLoadingWatcher() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const isOpeningCardCheckout = Array.from(document.querySelectorAll("button")).some(
        (button) => button.textContent?.includes("Opening Secure Checkout"),
      );
      setVisible(isOpeningCardCheckout);
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["disabled"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Preparing secure checkout"
      className="fixed inset-0 z-[10000] h-[100dvh] overflow-hidden bg-[#030309] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(118,82,255,0.20),transparent_24%),radial-gradient(circle_at_22%_58%,rgba(0,205,238,0.12),transparent_26%),radial-gradient(circle_at_80%_48%,rgba(255,72,152,0.12),transparent_28%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-[18%] top-[55%] h-px w-[80%] rotate-[10deg] bg-gradient-to-r from-transparent via-cyan-400/25 to-violet-500/20" />
        <div className="absolute right-[-20%] top-[28%] h-px w-[78%] -rotate-[8deg] bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />
        <div className="absolute left-[9%] top-[18%] h-1 w-1 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
        <div className="absolute right-[13%] top-[23%] h-1 w-1 rounded-full bg-cyan-100/80 shadow-[0_0_12px_rgba(165,243,252,0.9)]" />
        <div className="absolute left-[16%] bottom-[22%] h-1 w-1 rounded-full bg-violet-100/70 shadow-[0_0_12px_rgba(221,214,254,0.8)]" />
        <div className="absolute right-[8%] bottom-[30%] h-1 w-1 rounded-full bg-pink-100/70 shadow-[0_0_12px_rgba(252,231,243,0.8)]" />
      </div>

      <div className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] sm:left-8 sm:top-7">
        <div className="rounded-full border border-cyan-400/35 bg-black/35 px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.09)] backdrop-blur-md sm:px-4 sm:text-[10px]">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_9px_rgba(103,232,249,0.95)] motion-reduce:animate-none" />
          Loading secure checkout
        </div>
      </div>

      <div className="absolute right-8 top-8 hidden text-[9px] font-semibold uppercase tracking-[0.4em] text-white/35 md:block">
        Science × Purity × Progress
      </div>

      <div className="relative z-10 flex h-[100dvh] items-center justify-center px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(4.5rem,env(safe-area-inset-top))] sm:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          <div className="relative mx-auto mb-7 flex h-32 w-32 items-center justify-center sm:mb-9 sm:h-40 sm:w-40 md:h-44 md:w-44">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#31ddf4,#4b82ff,#9b5cff,#ff5ba5,#ffb35c,#31ddf4)] p-[2px] shadow-[0_0_26px_rgba(99,102,241,0.28),0_0_48px_rgba(236,72,153,0.10)] motion-safe:animate-spin [animation-duration:2.1s]">
              <div className="h-full w-full rounded-full bg-[#05050c]" />
            </div>
            <div className="absolute inset-[9px] rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_42%,rgba(123,97,255,0.12),rgba(4,4,11,0.96)_64%)]" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-100/90 sm:text-[11px]">
                Loading
              </p>
              <div className="mt-2 flex justify-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 motion-reduce:animate-none" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300 [animation-delay:150ms] motion-reduce:animate-none" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-300 [animation-delay:300ms] motion-reduce:animate-none" />
              </div>
            </div>
          </div>

          <h2 className="font-display text-[2.15rem] font-black uppercase leading-[0.92] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            Preparing
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-amber-300 to-violet-400 bg-clip-text text-transparent">
              Secure Checkout
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Please wait while we connect you to secure checkout.
          </p>
          <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/35 sm:text-[10px] sm:tracking-[0.36em]">
            Do not refresh or close this page.
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-3">
            <LoadingCard
              icon={
                <path d="M12 3 5.5 5.7v5.4c0 4.5 2.7 7.9 6.5 9.9 3.8-2 6.5-5.4 6.5-9.9V5.7L12 3Zm-1 11.1-2.2-2.2 1.2-1.2 1 1 3.1-3.1 1.2 1.2-4.3 4.3Z" />
              }
              title="Secure Payments"
              copy="Protected checkout"
              tone="cyan"
            />
            <LoadingCard
              icon={
                <>
                  <rect x="6" y="10" width="12" height="9" rx="2" />
                  <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" fill="none" stroke="currentColor" strokeWidth="1.7" />
                </>
              }
              title="Encrypted Connection"
              copy="Your data stays protected"
              tone="violet"
            />
            <LoadingCard
              icon={<path d="M17.7 6.3A8 8 0 1 0 20 12h-2a6 6 0 1 1-1.8-4.3L13 11h8V3l-3.3 3.3Z" />}
              title="Redirecting"
              copy="Almost there..."
              tone="pink"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingCard({
  icon,
  title,
  copy,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
  tone: "cyan" | "violet" | "pink";
}) {
  const toneClasses = {
    cyan: "border-cyan-400/20 bg-cyan-400/[0.04] text-cyan-200",
    violet: "border-violet-400/20 bg-violet-400/[0.04] text-violet-200",
    pink: "border-pink-400/20 bg-pink-400/[0.04] text-pink-200",
  }[tone];

  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left backdrop-blur-md sm:flex-col sm:items-start sm:gap-2.5 sm:px-4 sm:py-4 ${toneClasses}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/35">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" aria-hidden="true">
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-[12px] font-bold text-white sm:text-[13px]">{title}</p>
        <p className="mt-0.5 text-[10px] text-white/42 sm:text-[11px]">{copy}</p>
      </div>
    </div>
  );
}
