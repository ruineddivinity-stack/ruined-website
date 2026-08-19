import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Logo3D } from "@/components/sections/Logo3D";

export function Mission() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-steel-700/40 via-steel-600/20 to-black py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal y={20}>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-steel-500/40 bg-steel-700/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-steel-300">
                <CheckIcon />
                Learn About Us
              </span>

              <h2 className="mt-6 font-display text-4xl font-black uppercase leading-tight tracking-tight text-fg sm:text-5xl">
                Our Mission
              </h2>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-muted">
                RUINED exists for researchers who expect more from a
                supplier. We hold every batch to a strict internal purity
                and identity standard, ship fast, and package discreetly —
                no shortcuts, no filler, no vague sourcing.
              </p>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-chrome-300"
              >
                About Us
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={20}>
            <div className="flex items-center justify-center">
              <Logo3D />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Reveal delay={0.15} y={20}>
            <InfoCard
              title="Sourcing Standards"
              desc="We work only with vetted manufacturing partners and screen every batch before it's listed."
            />
          </Reveal>
          <Reveal delay={0.25} y={20}>
            <InfoCard
              title="Built For Researchers"
              desc="Straightforward ordering, fast dispatch, and support that actually knows the catalog."
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-steel-500/30 bg-black/30 p-6">
      <h3 className="font-display text-sm font-black uppercase tracking-wide text-fg">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{desc}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
