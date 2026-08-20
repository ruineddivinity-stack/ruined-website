import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HoloBlob } from "@/components/layout/HoloBlob";
import { Logo3D } from "@/components/sections/Logo3DLazy";
import { ScrollLink } from "@/components/ui/ScrollLink";

export const metadata: Metadata = {
  title: "Affiliate Program | RUINED",
  description:
    "Share RUINED with your audience, give them a discount, and earn commission on every order placed with your code.",
};

const steps = [
  {
    n: 1,
    title: "Create an Account",
    desc: "Sign in or create a free RUINED account — it only takes a minute.",
    icon: UserIcon,
  },
  {
    n: 2,
    title: "Apply for a Code",
    desc: "Pick your preferred discount code and submit your application from your dashboard.",
    icon: TagIcon,
  },
  {
    n: 3,
    title: "Share It",
    desc: "Once approved, share your code with your audience — active instantly, no extra setup.",
    icon: ShareIcon,
  },
  {
    n: 4,
    title: "Earn & Track",
    desc: "Earn commission on every order placed with your code, tracked live in your dashboard.",
    icon: ChartIcon,
  },
];

const yourSide = [
  "Earn commission on every order placed with your code",
  "No cap on what you can earn",
  "Request a payout any time, right from your dashboard",
];

const theirSide = [
  "Your audience saves at checkout with your code",
  "Applies automatically — no extra steps for them",
  "A real reason to buy through you, not a competitor",
];

export default function AffiliatesPage() {
  return (
    <div className="pb-8">
      <section className="relative overflow-hidden bg-[rgba(3,3,4,0.65)] bg-glass pb-20 pt-14 sm:pt-20">
        <HoloBlob className="-z-10 -top-40 right-[-10%]" size={560} animated={false} />
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="badge-holo inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-chrome-100 backdrop-blur-md">
              <DollarIcon />
              Partner Program
            </span>

            <h1 className="mt-6 font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
              Share Ruined.
              <br />
              <span className="text-gradient-holo">Earn on every order.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted">
              Turn your audience&rsquo;s trust into real commission. Get your
              own custom discount code, share it with your community, and
              earn on every order placed with it &mdash; no minimums to
              apply, no waiting on an approval queue.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/account/affiliate">Become an Affiliate</Button>
              <ScrollLink
                targetId="how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold tracking-wide text-fg-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-steel-500 hover:text-fg"
              >
                See How It Works
              </ScrollLink>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-border-soft pt-5">
              <FeatureChip icon={TagIcon} label="Your own code" />
              <FeatureChip icon={ChartIcon} label="Real commission" />
              <FeatureChip icon={EyeIcon} label="Full transparency" />
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center">
            <HoloBlob className="-z-10 -top-16 left-1/2 -translate-x-1/2" size={560} />
            <Logo3D />
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-fg-faint">
              Ruined the standard, elevated the research
            </p>
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-[150px] py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How It Works"
              title="Four steps to your first payout"
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="group relative h-full rounded-2xl border border-border bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-steel-500/50 hover:shadow-[0_0_24px_2px_rgba(140,82,199,0.25)]">
                  <span className="font-display text-3xl font-black text-gradient-holo">
                    0{step.n}
                  </span>
                  <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-b from-steel-700/40 to-steel-700/10 text-steel-300 transition-transform duration-300 group-hover:scale-110">
                    <step.icon />
                  </div>
                  <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface/70 py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Win-Win"
              title="Built for both sides"
              description="You earn on every order, and your audience saves on every order. Straightforward, no fine print."
              align="center"
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal>
              <SideCard title="Your Payout" icon={WalletIcon} items={yourSide} accent />
            </Reveal>
            <Reveal delay={0.1}>
              <SideCard title="Their Discount" icon={GiftIcon} items={theirSide} />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
                Your Dashboard
              </p>
              <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
                See exactly what you&rsquo;ve earned
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted">
                Every approved affiliate gets a live dashboard &mdash;
                unpaid commission, pending payouts, and how many times your
                code has been used, updated in real time. Request a payout
                whenever you&rsquo;re ready.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                <DashPoint icon={ChartIcon} text="Real-time commission tracking" />
                <DashPoint icon={WalletIcon} text="Request a payout any time" />
                <DashPoint icon={TagIcon} text="See how many times your code has been used" />
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-steel-500/30 bg-surface-2 p-6 shadow-[0_0_60px_-10px_rgba(140,82,199,0.35)] sm:p-8">
                <HoloBlob className="-right-16 -top-20" size={288} animated={false} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-fg-faint">
                      Affiliate Dashboard
                    </span>
                    <span className="rounded-full border border-steel-500/40 bg-steel-700/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-steel-300">
                      Example
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <MockStat label="Unpaid" value="$186.40" />
                    <MockStat label="Pending" value="$40.00" />
                    <MockStat label="Uses" value="27" />
                  </div>

                  <div className="mt-5 rounded-2xl border border-border bg-surface/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-fg-faint">
                          Your Code
                        </p>
                        <p className="mt-1 font-display text-lg font-black tracking-widest text-gradient-holo">
                          YOURNAME10
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-steel-500/40 bg-steel-700/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-steel-300">
                        Request Payout
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] leading-relaxed text-fg-faint">
                    Illustrative example. Your dashboard reflects your own
                    code, real usage, and real commission.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-4">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-steel-500/30 bg-gradient-to-br from-steel-700/25 via-surface-2 to-black px-8 py-16 text-center">
              <HoloBlob className="-left-24 -top-24" size={288} animated={false} />
              <div className="relative flex flex-col items-center gap-5">
                <h2 className="font-display text-3xl font-black uppercase tracking-tight text-gradient-holo sm:text-4xl">
                  Ready to start earning?
                </h2>
                <p className="max-w-md text-sm text-fg-muted">
                  Apply in minutes. No minimums, no waiting on approval
                  queues.
                </p>
                <Button href="/account/affiliate">Become an Affiliate</Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}

function FeatureChip({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-steel-700/40 to-steel-700/10 text-steel-300">
        <Icon className="h-4 w-4" />
      </span>
      {label}
    </div>
  );
}

function SideCard({
  title,
  items,
  icon: Icon,
  accent = false,
}: {
  title: string;
  items: string[];
  icon: ComponentType<{ className?: string }>;
  accent?: boolean;
}) {
  return (
    <div
      className={`h-full rounded-3xl border p-8 transition-colors duration-300 ${
        accent
          ? "border-steel-500/40 bg-gradient-to-b from-steel-700/20 to-surface-2 hover:border-steel-400"
          : "border-border bg-surface/60 hover:border-steel-500/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-steel-700/50 to-steel-700/10 text-steel-300">
          <Icon />
        </span>
        <h3 className="font-display text-xl font-black uppercase tracking-tight text-fg">
          {title}
        </h3>
      </div>
      <ul className="mt-6 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-fg-muted">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-steel-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DashPoint({
  icon: Icon,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <li className="flex items-center gap-3 text-sm text-fg-muted">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-steel-700/50 to-steel-700/10 text-steel-300">
        <Icon className="h-4 w-4" />
      </span>
      {text}
    </li>
  );
}

function MockStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-steel-600/40 bg-gradient-to-b from-steel-700/25 to-steel-700/5 py-3 text-center">
      <p className="font-display text-base font-black text-fg">{value}</p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-fg-faint">
        {label}
      </p>
    </div>
  );
}

function iconProps(className?: string) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 2v20" />
      <path d="M17 6.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 3 5 3 5 1.1 5 3-2.2 3-5 3-5-1.1-5-3" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M20 12.5 12.5 20a1.5 1.5 0 0 1-2.1 0L4 13.6a1.5 1.5 0 0 1 0-2.1L11.5 4H18a2 2 0 0 1 2 2v6.5Z" />
      <circle cx="15.5" cy="8.5" r="1.25" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.7 15.8 6.3M8.2 13.3l7.6 4.4" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M4 13h16M12 9v11" />
      <path d="M12 9c-1.8 0-3.2-1.2-3.2-2.8S9.2 3.5 10.5 3.5c1.6 0 2.5 2.2 2.5 2.2" />
      <path d="M12 9c1.8 0 3.2-1.2 3.2-2.8S13.8 3.5 12.5 3.5c-1.6 0-2.5 2.2-2.5 2.2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
