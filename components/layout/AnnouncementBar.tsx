const messages = [
  { label: "CODE RX FOR 10% OFF", icon: TagIcon },
  { label: "SHIPS WITHIN 24-48 HOURS", icon: TruckIcon },
  { label: "99% PURITY", icon: StarIcon },
  { label: "3RD PARTY TESTED", icon: ShieldIcon },
];

export function AnnouncementBar() {
  const loop = [...messages, ...messages];

  return (
    <div className="w-full overflow-hidden border-b border-border-soft bg-surface/80 py-2">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {loop.map((msg, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-muted"
          >
            <msg.icon className="shrink-0 text-steel-400" />
            {msg.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function iconProps(className?: string) {
  return {
    width: 12,
    height: 12,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
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
