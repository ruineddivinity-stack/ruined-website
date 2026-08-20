export function HoloBlob({
  className = "",
  size = 480,
  animated = true,
}: {
  className?: string;
  size?: number;
  animated?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`holo-blob pointer-events-none absolute rounded-full ${
        animated ? "holo-blob-drift" : ""
      } ${className}`}
      style={{
        width: size,
        height: size,
        background:
          "conic-gradient(from 180deg, var(--color-holo-violet), var(--color-holo-blue), var(--color-holo-pink), var(--color-holo-gold), var(--color-holo-violet))",
        opacity: 0.55,
      }}
    />
  );
}
