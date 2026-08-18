export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-steel-400">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-fg">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-fg-muted text-base leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
