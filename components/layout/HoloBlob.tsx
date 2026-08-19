"use client";

import { motion } from "framer-motion";

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
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: `clamp(200px, 55vw, ${size}px)`,
        height: `clamp(200px, 55vw, ${size}px)`,
        background:
          "conic-gradient(from 180deg, var(--color-holo-violet), var(--color-holo-blue), var(--color-holo-pink), var(--color-holo-gold), var(--color-holo-violet))",
        filter: "blur(90px) saturate(140%)",
        opacity: 0.4,
      }}
      animate={
        animated
          ? {
              x: [0, 24, -16, 0],
              y: [0, -20, 14, 0],
              rotate: [0, 20, -10, 0],
            }
          : undefined
      }
      transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
    />
  );
}
