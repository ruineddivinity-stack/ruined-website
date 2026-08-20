export function LightRefraction() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="light-refraction-svg absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="refraction-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-holo-blue)" />
            <stop offset="50%" stopColor="var(--color-holo-violet)" />
            <stop offset="100%" stopColor="var(--color-holo-pink)" />
          </linearGradient>
          <linearGradient id="refraction-b" x1="100%" y1="10%" x2="10%" y2="100%">
            <stop offset="0%" stopColor="var(--color-holo-pink)" />
            <stop offset="100%" stopColor="var(--color-holo-blue)" />
          </linearGradient>
        </defs>

        <g style={{ filter: "blur(20px)" }}>
          <path
            d="M -100 640 C 260 430, 540 720, 900 400 S 1520 250, 1620 110"
            stroke="url(#refraction-a)"
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
            opacity={0.55}
          />
          <path
            d="M 220 -60 C 400 190, 300 460, 630 490 S 1120 380, 1320 660"
            stroke="url(#refraction-b)"
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            opacity={0.45}
          />
        </g>

        <g>
          <path
            d="M -100 640 C 260 430, 540 720, 900 400 S 1520 250, 1620 110"
            stroke="url(#refraction-a)"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.8}
          />
          <path
            d="M 220 -60 C 400 190, 300 460, 630 490 S 1120 380, 1320 660"
            stroke="url(#refraction-b)"
            strokeWidth={1}
            fill="none"
            strokeLinecap="round"
            opacity={0.7}
          />
        </g>
      </svg>
    </div>
  );
}
