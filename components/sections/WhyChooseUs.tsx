import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const items = [
  {
    title: "Verified Purity",
    desc: "Every compound tests above 99% purity via independent HPLC analysis.",
    icon: BeakerIcon,
  },
  {
    title: "Discreet Packaging",
    desc: "Unmarked, resealed shipments with no external branding.",
    icon: LockIcon,
  },
  {
    title: "24hr Dispatch",
    desc: "Orders placed before 2pm ship the same business day.",
    icon: ClockIcon,
  },
  {
    title: "Real Support",
    desc: "A dedicated team that actually answers batch and shipping questions.",
    icon: ChatIcon,
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-surface/70 py-24">
      <Container>
        <SectionHeading
          eyebrow="Why RUINED"
          title="Built for people who check the data"
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col items-start">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-steel-700/40 to-steel-700/10 text-steel-300">
                <item.icon />
              </div>
              <h3 className="mt-5 text-base font-semibold text-fg">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function iconProps() {
  return {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function BeakerIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M9 3h6M10 3v6l-5.5 9.5A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.3-2.5L14 9V3" />
      <path d="M7.5 15h9" />
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

function ClockIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 5h16v11H8l-4 4Z" />
    </svg>
  );
}
