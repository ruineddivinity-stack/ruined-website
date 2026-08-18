const items = [
  { label: "CODE RX FOR 10% OFF", icon: TagIcon },
  { label: "SHIPS WITHIN 24-48 HOURS", icon: TruckIcon },
  { label: "99% PURITY", icon: StarIcon },
  { label: "3RD PARTY TESTED", icon: ShieldIcon },
];

export function TrustStrip() {
  const loop = [...items, ...items];

  return (
    <div className="w-full overflow-hidden border-y border-border-soft bg-surface/70 py-5">
      <div className="flex w-max animate-marquee-fast items-center gap-16 whitespace-nowrap">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-16">
            <span className="flex items-center gap-2.5">
              <item.icon className="shrink-0 text-steel-400" />
              <span className="font-display text-sm font-medium tracking-[0.2em] text-gradient-holo">
                {item.label}
              </span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-steel-600" aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}

function iconProps(className?: string) {
  return {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12.6 3H5a2 2 0 0 0-2 2v7.6a2 2 0 0 0 .59 1.41l8.4 8.4a2 2 0 0 0 2.82 0l7.6-7.6a2 2 0 0 0 0-2.82l-8.4-8.4A2 2 0 0 0 12.6 3Z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7.5" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9 6.4 20l1.4-6.2-4.8-4.3 6.4-.6Z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
