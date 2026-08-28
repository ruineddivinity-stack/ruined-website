import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedResearcherStat } from "@/components/sections/AnimatedResearcherStat";
import { HoloBlob } from "@/components/layout/HoloBlob";
import { HeroVialCluster } from "@/components/sections/HeroVialCluster";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { VipBadge } from "@/components/ui/VipBadge";
import { GiftTierAnnouncement } from "@/components/sections/GiftTierAnnouncement";

export function Hero() {
  return (
    <section className="relative -mt-[125px] overflow-hidden bg-[rgba(3,3,4,0.65)] bg-glass pt-[125px] sm:-mt-[130px] sm:pt-[130px]">
      <HoloBlob className="-z-10 -top-40 right-[-10%]" size={560} animated={false} />
      <Container className="grid min-h-0 grid-cols-1 items-center gap-8 py-10 sm:gap-12 sm:py-14 lg:min-h-[600px] lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            <Badge tone="steel">Research-Grade Purity</Badge>
          </div>

          <h1 className="mt-5 font-display text-[2.5rem] font-black uppercase leading-[1.05] tracking-tight text-fg sm:mt-6 sm:text-6xl">
            Ruined the standards.
            <br />
            <span className="text-gradient-holo">Elevated your research.</span>
          </h1>

          <GiftTierAnnouncement className="mt-5 sm:mt-6" />

          <p className="mt-3 text-sm text-fg-muted sm:mt-4">
            Third-party tested research peptides, shipped fast.
          </p>

          <div className="mx-auto mt-6 flex w-fit flex-col items-stretch gap-4 sm:mt-8 lg:mx-0">
            <Button href="/shop" className="w-full uppercase">
              Shop Now
            </Button>

            <ScrollLink
              targetId="vip-notifications"
              className="block transition-transform duration-300 hover:scale-105"
            >
              <VipBadge />
            </ScrollLink>
          </div>

          <div className="mt-8 flex items-center gap-6 border-t border-border-soft pt-5 sm:mt-10">
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
