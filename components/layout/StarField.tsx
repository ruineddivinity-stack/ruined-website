const STAR_COUNT = 160;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999.7) * 43758.5453;
  return x - Math.floor(x);
}

type Star = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  bright: boolean;
};

function buildStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const left = seededRandom(i * 1.37 + 1) * 100;
    const top = seededRandom(i * 2.71 + 7) * 50;
    const sizeRoll = seededRandom(i * 3.53 + 13);
    const bright = sizeRoll > 0.82;
    const size = (bright ? 2.4 : 1.2) + sizeRoll * 1.8;
    const duration = 2 + seededRandom(i * 4.11 + 19) * 3.5;
    const delay = seededRandom(i * 5.87 + 23) * 5;
    return { left, top, size, duration, delay, bright };
  });
}

const stars = buildStars();

export function StarField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 50% at 50% 0%, rgba(138,92,242,0.28), transparent 72%)," +
            "radial-gradient(55% 40% at 15% 85%, rgba(31,200,221,0.20), transparent 75%)," +
            "radial-gradient(50% 40% at 90% 60%, rgba(242,70,158,0.14), transparent 75%)",
        }}
      />
      <div className="absolute inset-0 h-[200%] w-full animate-star-drift">
        {[0, 50].map((offset) =>
          stars.map((s, i) => (
            <span
              key={`${offset}-${i}`}
              className={`star-dot absolute rounded-full animate-twinkle ${
                s.bright ? "bg-white" : "bg-chrome-100"
              }`}
              style={{
                left: `${s.left}%`,
                top: `${s.top + offset}%`,
                width: s.size,
                height: s.size,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
                // Box-shadow glow is real GPU compositing cost multiplied
                // across ~320 simultaneously-animating elements — only the
                // minority "bright" stars (~18%) get one.
                boxShadow: s.bright
                  ? "0 0 8px 2px rgba(163, 238, 244, 0.9)"
                  : undefined,
              }}
            />
          )),
        )}
      </div>
    </div>
  );
}
