import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const badges = [
  {
    title: "Third-Party Tested",
    desc: "Every batch checked for identity and purity before it ships.",
    icon: ShieldIcon,
  },
  {
    title: "Fast & Discreet Shipping",
    desc: "Same-day dispatch, plain unmarked packaging.",
    icon: TruckIcon,
  },
  {
    title: "99%+ Purity",
    desc: "Research-grade compounds held to a strict purity standard.",
    icon: StarIcon,
  },
  {
    title: "Secure Checkout",
    desc: "Encrypted payments, protected customer data.",
    icon: LockIcon,
  },
];

export function TrustBadges() {
  return (
    <section className="border-b border-border-soft bg-[rgba(3,3,4,0.65)] py-10">
      <Container>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-[0_0_24px_2px_rgba(31,200,221,0.25)]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-steel-700/50 to-steel-700/10 text-steel-300">
                  <b.icon />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-fg">{b.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                    {b.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function iconProps() {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function ShieldIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7.5" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9 6.4 20l1.4-6.2-4.8-4.3 6.4-.6Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
