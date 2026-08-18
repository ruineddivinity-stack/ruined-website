import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedResearcherStat } from "@/components/sections/AnimatedResearcherStat";
import { HoloBlob } from "@/components/layout/HoloBlob";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black/65 bg-noise">
      <HoloBlob className="-top-40 right-[-10%]" size={560} animated={false} />
      <Container className="grid min-h-[640px] grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <Badge tone="steel">Third-Party Tested</Badge>

          <h1 className="mt-6 font-display text-5xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-6xl">
            Research peptides,
            <br />
            <span className="text-gradient-holo">verified to the batch.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted">
            RUINED sources and tests every compound to &gt;99% purity. No
            guesswork, no vague sourcing — just a supplier that treats
            quality control as non-negotiable.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/shop">Shop the Catalog</Button>
            <Button href="/about" variant="secondary">
              Our Mission
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-8 border-t border-border-soft pt-6">
            <Stat value="99%+" label="Avg. purity" />
            <AnimatedResearcherStat />
            <Stat value="24hr" label="Dispatch time" />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <HoloBlob className="-z-10 -top-16 left-1/2 -translate-x-1/2" size={560} />
          <div className="relative aspect-square w-full max-w-md rounded-[2rem] border border-border bg-gradient-to-b from-surface-2 to-black p-10">
            <div
              aria-hidden
              className="absolute inset-0 rounded-[2rem] border border-chrome-500/20"
            />
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="flex h-40 w-28 items-center justify-center rounded-xl border border-chrome-500/30 bg-gradient-to-b from-surface-3 to-surface bg-noise">
                <span className="font-display text-sm font-semibold tracking-widest text-gradient-holo">
                  RUINED
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-fg-faint">
                Purity-checked vial
              </p>
              <Link
                href="/shop"
                className="text-sm font-semibold text-steel-400 underline underline-offset-4 hover:text-steel-300"
              >
                Browse the catalog
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-fg">{value}</p>
      <p className="text-xs uppercase tracking-widest text-fg-faint">{label}</p>
    </div>
  );
}
