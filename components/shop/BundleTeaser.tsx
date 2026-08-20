export function BundleTeaser() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-steel-500/30 bg-surface/60 px-5 py-4">
      <Step icon={FlaskIcon} label="Pick any 4 vials" />
      <Sign>+</Sign>
      <Step icon={GiftIcon} label="5th item free — BAC water" highlight />
      <Sign>=</Sign>
      <span className="flex items-center gap-2 font-display text-base font-black text-gradient-holo">
        <PercentIcon />
        25% off the bundle
      </span>
    </div>
  );
}

function Step({
  icon: Icon,
  label,
  highlight = false,
}: {
  icon: (props: { className?: string }) => React.JSX.Element;
  label: string;
  highlight?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          highlight ? "text-chrome-100" : "bg-gradient-to-b from-steel-700/50 to-steel-700/10 text-steel-300"
        }`}
        style={
          highlight
            ? {
                background:
                  "linear-gradient(to bottom, color-mix(in srgb, var(--color-holo-violet) 40%, transparent), color-mix(in srgb, var(--color-holo-violet) 10%, transparent))",
              }
            : undefined
        }
      >
        <Icon />
      </span>
      <span className="text-sm font-semibold text-fg">{label}</span>
    </span>
  );
}

function Sign({ children }: { children: React.ReactNode }) {
  return <span className="text-lg font-bold text-fg-faint">{children}</span>;
}

function iconProps() {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function FlaskIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M9 3h6" />
      <path d="M10 3v6.5L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8" />
      <path d="M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg {...iconProps()} width={16} height={16}>
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
