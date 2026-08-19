import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedResearcherStat } from "@/components/sections/AnimatedResearcherStat";
import { HoloBlob } from "@/components/layout/HoloBlob";
import { HeroVialCluster } from "@/components/sections/HeroVialCluster";
import { ScrollLink } from "@/components/ui/ScrollLink";

export function Hero() {
  return (
    <section className="relative -mt-[125px] overflow-hidden bg-[rgba(3,3,4,0.65)] bg-glass pt-[125px] sm:-mt-[130px] sm:pt-[130px]">
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

          <ScrollLink
            targetId="vip-notifications"
            className="badge-holo mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-chrome-100 backdrop-blur-md transition-transform duration-300 hover:scale-105"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <BellIcon />
            VIP Notifications
          </ScrollLink>

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

function BellIcon() {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
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
