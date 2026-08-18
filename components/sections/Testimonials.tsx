import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviews } from "@/lib/products";

export function Testimonials() {
  return (
    <section className="bg-surface/70 py-24">
      <Container>
        <SectionHeading
          eyebrow="Reviews"
          title="Trusted by researchers who verify their own vials"
          align="center"
        />

        <div className="mt-12 -mx-6 flex gap-5 overflow-x-auto scrollbar-none px-6 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="flex w-[260px] shrink-0 flex-col rounded-2xl border border-border bg-black p-6 transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-[0_0_24px_2px_rgba(31,200,221,0.25)] lg:w-auto"
            >
              <div className="flex gap-0.5 text-steel-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < r.rating} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-muted">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="mt-5 border-t border-border-soft pt-4">
                <p className="text-sm font-semibold text-fg">{r.name}</p>
                <p className="text-xs text-fg-faint">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2.5l2.9 6.2 6.8.6-5.1 4.6 1.5 6.7-6.1-3.6-6.1 3.6 1.5-6.7-5.1-4.6 6.8-.6Z" strokeLinejoin="round" />
    </svg>
  );
}
