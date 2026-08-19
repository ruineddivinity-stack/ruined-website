import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedResearcherStat } from "@/components/sections/AnimatedResearcherStat";
import { HoloBlob } from "@/components/layout/HoloBlob";
import { HeroVialCluster } from "@/components/sections/HeroVialCluster";

export function Hero() {
  return (
    <section className="relative -mt-[125px] overflow-hidden bg-black/65 bg-glass pt-[125px] sm:-mt-[130px] sm:pt-[130px]">
      <HoloBlob className="-z-10 -top-40 right-[-10%]" size={560} animated={false} />
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

          <div className="mt-10 flex items-center gap-6 border-t border-border-soft pt-5">
            <Stat value="99%+" label="Avg. purity" />
            <AnimatedResearcherStat />
            <Stat value="24hr" label="Dispatch time" />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <HoloBlob className="-z-10 -top-16 left-1/2 -translate-x-1/2" size={560} />
          <HeroVialCluster />
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-lg font-semibold text-fg">{value}</p>
      <p className="text-[11px] uppercase tracking-widest text-fg-faint">{label}</p>
    </div>
  );
}
