import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "COAs | RUINED",
};

export default function LabResultsPage() {
  return (
    <div className="py-24">
      <Container className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
          COAs
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-fg sm:text-5xl">
          Coming Soon
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-fg-muted">
          We&apos;re building out a public library of independent lab
          results for every batch we sell. It isn&apos;t live yet —
          we&apos;d rather launch it right than launch it early. In the
          meantime, every compound in our catalog is screened internally
          for identity and purity before it&apos;s listed.
        </p>
        <div className="mt-8">
          <Button href="/shop">Shop the Catalog</Button>
        </div>
      </Container>
    </div>
  );
}
