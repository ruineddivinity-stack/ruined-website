"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { AGE_GATE_COOKIE } from "@/lib/age-gate";
import { SUBSCRIBER_CODE } from "@/lib/discounts";

export const OPEN_WELCOME_POPUP_EVENT = "ruined:open-welcome-popup";
export const SUBSCRIBED_STORAGE_KEY = "ruined-subscribed";

const SEEN_KEY = "ruined-welcome-seen";
const REVEAL_DELAY_MS = 2500;
const BLOCKED_PREFIXES = ["/checkout", "/account"];

function ageGateDismissed() {
  return document.cookie.includes(`${AGE_GATE_COOKIE}=`);
}

export function WelcomePopup({ ageGateOpen }: { ageGateOpen: boolean }) {
  const pathname = usePathname();
  const { setCoupon } = useCart();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "done">(
    "idle",
  );

  const blocked = BLOCKED_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (blocked) return;
    try {
      if (window.localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return;
    }

    let cancelled = false;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleReveal = () => {
      revealTimer = setTimeout(() => {
        if (!cancelled) setVisible(true);
      }, REVEAL_DELAY_MS);
    };

    if (!ageGateOpen || ageGateDismissed()) {
      scheduleReveal();
    } else {
      const poll = setInterval(() => {
        if (ageGateDismissed()) {
          clearInterval(poll);
          scheduleReveal();
        }
      }, 500);
      return () => {
        cancelled = true;
        clearInterval(poll);
        if (revealTimer) clearTimeout(revealTimer);
      };
    }

    return () => {
      cancelled = true;
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, [blocked, ageGateOpen]);

  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener(OPEN_WELCOME_POPUP_EVENT, open);
    return () => window.removeEventListener(OPEN_WELCOME_POPUP_EVENT, open);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
  };

  const submit = async () => {
    if (!email.trim() || status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setCoupon({ code: SUBSCRIBER_CODE, discountType: "percent", amount: 10 });
      try {
        window.localStorage.setItem(SEEN_KEY, "1");
        window.localStorage.setItem(SUBSCRIBED_STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      setStatus("done");
      void data;
      setTimeout(() => setVisible(false), 2200);
    } catch {
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <>
      <div
        onClick={dismiss}
        aria-hidden
        className="fixed inset-0 z-[90] bg-[rgba(3,3,4,0.75)] backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-label="Get 10% off"
        className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-steel-500/30 bg-surface-2 shadow-[0_0_60px_-10px_rgba(140,82,199,0.4)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-40 blur-[80px]"
          style={{
            background:
              "conic-gradient(from 180deg, var(--color-holo-violet), var(--color-holo-blue), var(--color-holo-pink), var(--color-holo-gold), var(--color-holo-violet))",
          }}
        />

        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="absolute right-5 top-5 text-fg-muted hover:text-fg"
          >
            <CloseIcon />
          </button>

          {status === "done" ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-steel-700/30 text-steel-300">
                <CheckIcon />
              </span>
              <h2 className="font-display text-xl font-black uppercase tracking-tight text-fg">
                Code {SUBSCRIBER_CODE} Applied
              </h2>
              <p className="text-xs text-fg-muted">
                10% off is locked in for your order &mdash; it&rsquo;s yours
                forever, and it&rsquo;s already on its way to your inbox too.
              </p>
            </div>
          ) : (
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-steel-500/40 bg-steel-700/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-steel-300">
                <span className="h-1.5 w-1.5 rounded-full bg-steel-400" />
                NEW HERE?
              </span>
              <h2 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-tight text-gradient-holo sm:text-3xl">
                Sign Up &amp; Get 10% Off Forever
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                Join the list for your lifetime code, plus restock alerts and
                subscriber-only bulk deals.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="you@lab.com"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "submitting"}
                  className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-[0_0_0_1px_rgba(241,242,247,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_4px_rgba(203,206,218,0.45)] disabled:opacity-60"
                >
                  {status === "submitting" ? "Applying…" : "Unlock My Code"}
                </button>
                {status === "error" && (
                  <p className="text-xs text-danger">
                    Something went wrong &mdash; try again in a moment.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="mt-4 w-full text-center text-xs text-fg-faint hover:text-fg-muted"
              >
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
