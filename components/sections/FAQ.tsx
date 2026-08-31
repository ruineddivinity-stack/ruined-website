import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import {
  AFFILIATE_CODE,
  AFFILIATE_RATE,
  BULK_TIERS,
  FREE_SHIPPING_THRESHOLD,
  STACKED_SAVINGS_PCT,
} from "@/lib/discounts";

const faqs = [
  {
    q: "What are research peptides?",
    a: "Peptides are short chains of amino acids used in laboratory research to study cellular pathways, protein interactions, and assay development. Everything in our catalog is manufactured and sold strictly as a research compound for laboratory and in-vitro use — not for human or animal consumption.",
  },
  {
    q: "Do I need to verify anything before I can shop?",
    a: "Yes. Before browsing, you'll confirm you're 21 or older and a verified researcher, lab, or institution purchasing for legitimate research purposes. See our Research Use Only Policy for the full certification.",
  },
  {
    q: "How is purity tested?",
    a: "Every batch is screened internally for identity and purity via HPLC before it's listed, held to a strict 99%+ standard. We're also building out a public library of independent third-party COAs — check our COAs page for current status.",
  },
  {
    q: "How fast do orders ship?",
    a: "In-stock orders placed before 2:00pm CT on a business day ship the same day, and are typically fully processed within 24–36 hours. Our shipping operations run Monday–Friday, so orders placed after hours or on weekends begin processing the next business day.",
  },
  {
    q: "Do you offer free shipping?",
    a: `Orders totaling $${FREE_SHIPPING_THRESHOLD} or more ship free within the United States.`,
  },
  {
    q: "What's your return and refund policy?",
    a: "All sales are final — we don't issue monetary refunds. If your order arrives damaged, defective, incorrect, or is confirmed lost in transit, contact us within 24 hours of delivery with photo documentation and we'll resolve it with a reshipment or store credit. See our Refund Policy for details.",
  },
  {
    q: "Do you ship internationally?",
    a: "No, we do not ship to researchers internationally at this time. We ship within the United States only.",
  },
  {
    q: "How should compounds be stored?",
    a: "Lyophilized compounds should be kept in a freezer (-20°C) prior to reconstitution, and refrigerated after reconstitution for research use.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We're currently between card processors while we set up a new one, so CashApp is the available payment method at checkout for now. Card payments will be back shortly — see the note on the checkout page for details.",
  },
  {
    q: "Is there a discount code?",
    a: `Yes — use code "${AFFILIATE_CODE}" at checkout for ${AFFILIATE_RATE * 100}% off any order. It also stacks with bulk pricing: ${BULK_TIERS.bulk.label} saves ${BULK_TIERS.bulk.rate * 100}% on its own, or up to ${STACKED_SAVINGS_PCT.bulk}% combined with the code.`,
  },
  {
    q: "Can I become an affiliate?",
    a: "Yes. Apply for your own discount code from your account dashboard, share it with your audience, and earn commission on every order placed with it. Visit our Affiliates page to get started.",
  },
];

export function FAQ() {
  return (
    <section className="bg-[rgba(3,3,4,0.65)] py-24">
      <Container className="max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, Answered"
            align="center"
          />
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.06} y={16}>
              <details className="group rounded-2xl border border-border bg-surface/60 px-6 py-5 open:border-steel-500/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-fg [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronIcon className="shrink-0 text-fg-muted transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  {item.a}
                </p>
              </details>
            </Reveal>
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
