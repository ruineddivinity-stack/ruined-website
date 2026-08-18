import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  return (
    <section className="bg-black/65 py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-steel-500/30 bg-gradient-to-br from-steel-700/25 via-surface-2 to-black p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-steel-600/20 blur-[120px]"
          />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex items-start gap-5">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-steel-500/40 bg-steel-700/20">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-steel-500/25 blur-md"
                />
                <BoltIcon className="relative h-6 w-6 text-steel-300" />
              </div>

              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-steel-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-steel-400" />
                  VIP Access
                </span>
                <h2 className="mt-2 font-display text-3xl font-black uppercase text-gradient-blue sm:text-4xl">
                  Restock Alerts
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
                  Be first to know when sold-out compounds are back, plus new
                  batch drops and research notes.
                </p>
              </div>
            </div>

            <form className="flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
              />

              <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-5 py-3.5 focus-within:border-steel-500">
                <span className="text-xs font-semibold tracking-wide text-fg-muted">
                  US
                </span>
                <ChevronIcon className="h-3.5 w-3.5 text-fg-faint" />
                <span className="h-4 w-px bg-border" aria-hidden />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-transparent text-sm text-fg placeholder:text-fg-faint focus:outline-none"
                />
              </div>

              <p className="mt-1 text-xs leading-relaxed text-fg-faint">
                By submitting this form, you consent to receive
                informational (e.g., order updates) and/or marketing texts
                (e.g., restock alerts) from RUINED. Consent is not a
                condition of purchase. Msg &amp; data rates may apply. Msg
                frequency varies. Unsubscribe at any time by replying STOP.{" "}
                <a
                  href="/legal/privacy"
                  className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
                >
                  Privacy Policy
                </a>{" "}
                &amp;{" "}
                <a
                  href="/legal/terms"
                  className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
                >
                  Terms
                </a>
                .
              </p>

              <Button type="submit" className="mt-2 w-full justify-center">
                Join Notifications
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
