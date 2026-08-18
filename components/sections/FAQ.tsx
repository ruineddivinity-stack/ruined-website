import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const faqs = [
  {
    q: "What are research peptides?",
    a: "Peptides are short chains of amino acids used in laboratory research to study cellular pathways, protein interactions, and assay development. Everything in our catalog is manufactured and sold strictly as a research compound for laboratory and in-vitro use.",
  },
  {
    q: "Is this for human or animal use?",
    a: "No. Every product on this site is sold for laboratory research and in-vitro use only. Nothing here is intended for human or animal consumption, and none of our products have been evaluated by the FDA for safety or efficacy.",
  },
  {
    q: "How is purity tested?",
    a: "Every batch is screened for identity and purity using HPLC before it's listed, and held to a strict internal standard of 99%+.",
  },
  {
    q: "How fast do orders ship?",
    a: "In-stock orders dispatch within 24 hours. You'll get tracking information by email as soon as your order leaves our facility.",
  },
  {
    q: "How should compounds be stored?",
    a: "Lyophilized compounds should be kept in a freezer (-20°C) prior to reconstitution, and refrigerated after reconstitution for research use.",
  },
  {
    q: "Do you ship internationally?",
    a: "We currently ship within the United States. Reach out on the Contact page for specifics on future availability.",
  },
];

export function FAQ() {
  return (
    <section className="bg-black/65 py-24">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, Answered"
          align="center"
        />

        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-border bg-surface/60 px-6 py-5 open:border-steel-500/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-fg [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronIcon className="shrink-0 text-fg-muted transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
