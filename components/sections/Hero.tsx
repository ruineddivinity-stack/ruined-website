"use client";

import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedResearcherStat } from "@/components/sections/AnimatedResearcherStat";
import { HoloBlob } from "@/components/layout/HoloBlob";
import { HeroVialCluster } from "@/components/sections/HeroVialCluster";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { VipBadge } from "@/components/ui/VipBadge";
import { HeroBundleBanner } from "@/components/sections/HeroBundleBanner";
import { GiftTierAnnouncement } from "@/components/sections/GiftTierAnnouncement";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative -mt-[125px] overflow-hidden bg-[rgba(3,3,4,0.68)] bg-glass pt-[125px] sm:-mt-[130px] sm:pt-[130px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_44%,rgba(122,64,172,0.12),transparent_28%),radial-gradient(circle_at_70%_52%,rgba(40,190,224,0.08),transparent_30%),radial-gradient(circle_at_86%_48%,rgba(255,84,188,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[38%] z-10 hidden w-[24%] bg-gradient-to-r from-[#050507] via-[#050507]/68 to-transparent blur-xl lg:block" />
      <HoloBlob className="-z-10 -top-40 right-[-10%] opacity-60" size={560} animated={false} />

      <Container className="relative z-20 grid min-h-0 grid-cols-1 items-center gap-2 py-6 sm:gap-10 sm:py-14 lg:min-h-[640px] lg:grid-cols-[0.82fr_1.18fr] lg:gap-0 lg:py-14 xl:min-h-[690px]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-30 flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.div variants={item} className="flex flex-wrap justify-center gap-2 lg:justify-start">
            <Badge tone="steel">Research-Grade Purity</Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-3 font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:mt-6 sm:text-6xl"
          >
            Ruined the standards.
            <br />
            <span className="text-gradient-holo">Elevated your research.</span>
          </motion.h1>

          <motion.div variants={item} className="mt-3 w-full max-w-lg space-y-2.5 sm:mt-6 sm:space-y-3">
            <HeroBundleBanner />
            <GiftTierAnnouncement />
          </motion.div>

          <motion.p variants={item} className="mt-2 text-sm text-fg-muted sm:mt-4">
            Third-party tested research peptides, shipped fast.
          </motion.p>

          <motion.div
            variants={item}
            className="mx-auto mt-4 flex w-fit flex-col items-stretch gap-3 sm:mt-8 sm:gap-4 lg:mx-0"
          >
            <Button href="/shop" className="w-full uppercase">
              Shop Now
            </Button>

            <ScrollLink
              targetId="vip-notifications"
              className="block transition-transform duration-300 hover:scale-105"
            >
              <VipBadge />
            </ScrollLink>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-5 flex items-center gap-6 border-t border-border-soft pt-5 sm:mt-10"
          >
            <Stat value="99%+" label="Avg. purity" />
            <AnimatedResearcherStat />
            <Stat value="24hr" label="Dispatch time" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 -mx-4 mt-2 flex items-center justify-center sm:mx-0 lg:-mr-[8vw] lg:-ml-[7%] lg:mt-0 xl:-mr-[10vw]"
        >
          <div className="pointer-events-none absolute left-[6%] top-[18%] h-[64%] w-[76%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(246,109,220,0.13),rgba(78,201,255,0.08)_36%,transparent_72%)] blur-3xl" />
          <HeroVialCluster />
        </motion.div>
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
