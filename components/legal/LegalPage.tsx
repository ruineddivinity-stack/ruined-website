import { Container } from "@/components/ui/Container";
import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="py-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-fg-faint">
          Last updated {updated}
        </p>

        <div className="mt-10 flex flex-col gap-8">{children}</div>
      </Container>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-sm font-black uppercase tracking-widest text-steel-400">
        {heading}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-fg-muted">
        {children}
      </div>
    </section>
  );
}
