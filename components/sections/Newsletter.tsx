import { Container } from "@/components/ui/Container";
import { HoloBlob } from "@/components/layout/HoloBlob";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
import { VipBadge } from "@/components/ui/VipBadge";

const perks = [
  {
    title: "Restock alerts, instantly",
    desc: "Be first to know the second a sold-out batch is back.",
    icon: BellIcon,
  },
  {
    title: "Early access to new drops",
    desc: "New compounds hit subscriber inboxes before the shop page.",
    icon: RocketIcon,
  },
  {
    title: "Subscriber-only promos",
    desc: "Extra bulk & kit deals we don't advertise anywhere else.",
    icon: GiftIcon,
  },
];

export function Newsletter() {
  return (
    <section
      id="vip-notifications"
      className="scroll-mt-[150px] bg-[rgba(3,3,4,0.65)] py-24"
    >
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-steel-500/30 bg-gradient-to-br from-steel-700/25 via-surface-2 to-black p-8 sm:p-12">
            <HoloBlob className="-left-24 -top-24" size={288} animated={false} />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="flex items-start gap-5">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-steel-500/40 bg-steel-700/20">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-steel-500/25 blur-md"
                    />
                    <BoltIcon className="relative h-6 w-6 text-steel-300" />
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-steel-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-steel-400" />
                      VIP Access
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-black uppercase text-gradient-holo sm:text-4xl">
                      Restock Alerts
                    </h2>
                  </div>
                </div>

                <ul className="mt-6 flex flex-col gap-3">
                  {perks.map((perk) => (
                    <li key={perk.title} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-steel-700/50 to-steel-700/10 text-steel-300">
                        <perk.icon />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-fg">
                          {perk.title}
                        </span>
                        <span className="block text-xs leading-relaxed text-fg-muted">
                          {perk.desc}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <VipBadge className="mx-auto lg:mx-0" />
                <NewsletterForm />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function iconProps() {
  return {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M5 16s-1-4 3-8 9-4 9-4 1 5-3 9-9 3-9 3Z" />
      <path d="M9 15 5 19M8.5 12A2.5 2.5 0 1 1 12 8.5" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M4 13h16M12 9v11" />
      <path d="M12 9c-1.8 0-3.2-1.2-3.2-2.8S9.2 3.5 10.5 3.5c1.6 0 2.5 2.2 2.5 2.2" />
      <path d="M12 9c1.8 0 3.2-1.2 3.2-2.8S13.8 3.5 12.5 3.5c-1.6 0-2.5 2.2-2.5 2.2" />
    </svg>
  );
}
