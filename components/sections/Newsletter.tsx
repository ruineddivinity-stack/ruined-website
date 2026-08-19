import { Container } from "@/components/ui/Container";
import { HoloBlob } from "@/components/layout/HoloBlob";
import { NewsletterForm } from "@/components/sections/NewsletterForm";

export function Newsletter() {
  return (
    <section className="bg-black/65 py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-steel-500/30 bg-gradient-to-br from-steel-700/25 via-surface-2 to-black p-8 sm:p-12">
          <HoloBlob className="-left-24 -top-24" size={288} animated={false} />

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
                <h2 className="mt-2 font-display text-3xl font-black uppercase text-gradient-holo sm:text-4xl">
                  Restock Alerts
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
                  Be first to know when sold-out compounds are back, plus new
                  batch drops and research notes.
                </p>
              </div>
            </div>

            <NewsletterForm />
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
