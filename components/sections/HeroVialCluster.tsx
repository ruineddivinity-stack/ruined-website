"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Vial = {
  src: string;
  width: number;
  height: number;
  alt: string;
  glowColors: [string, string, string];
  className: string;
  displayWidth: number;
  floatDuration: number;
  floatDelay: number;
  zIndex: number;
};

const vials: Vial[] = [
  {
    src: "/vial-mots-c-v2.png",
    width: 389,
    height: 663,
    alt: "RUINED RX MOTS-C 20MG",
    glowColors: [
      "var(--color-holo-violet)",
      "var(--color-holo-blue)",
      "var(--color-holo-pink)",
    ],
    className: "left-[2%] top-[32%]",
    displayWidth: 170,
    floatDuration: 4.6,
    floatDelay: 0,
    zIndex: 10,
  },
  {
    src: "/vial-tesa-v2.png",
    width: 366,
    height: 675,
    alt: "RUINED RX Tesamorelin 20MG",
    glowColors: [
      "var(--color-holo-blue)",
      "var(--color-holo-pink)",
      "var(--color-holo-gold)",
    ],
    className: "left-1/2 top-0 -translate-x-1/2",
    displayWidth: 173,
    floatDuration: 5.2,
    floatDelay: 0.4,
    zIndex: 20,
  },
  {
    src: "/vial-klow-v2.png",
    width: 362,
    height: 619,
    alt: "RUINED RX KLOW 80MG",
    glowColors: [
      "var(--color-holo-pink)",
      "var(--color-holo-gold)",
      "var(--color-holo-violet)",
    ],
    className: "right-[2%] top-[28%]",
    displayWidth: 164,
    floatDuration: 4.9,
    floatDelay: 0.8,
    zIndex: 10,
  },
];

function GlowLayer({
  color,
  hovered,
  delay,
  baseOpacity,
}: {
  color: string;
  hovered: boolean;
  delay: number;
  baseOpacity: number;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-[10%] -z-10 rounded-full blur-2xl"
      style={{
        background: `radial-gradient(closest-side, ${color}, transparent 72%)`,
      }}
      animate={
        hovered
          ? { opacity: [baseOpacity, 0.95, baseOpacity] }
          : { opacity: baseOpacity }
      }
      transition={
        hovered
          ? { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay }
          : { duration: 0.5, ease: "easeOut" }
      }
    />
  );
}

function Vial({ vial }: { vial: Vial }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`absolute cursor-pointer ${vial.className}`}
      style={{ zIndex: vial.zIndex }}
      animate={{ y: [0, -16, 0] }}
      transition={{
        duration: vial.floatDuration,
        delay: vial.floatDelay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="relative"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <GlowLayer color={vial.glowColors[0]} hovered={hovered} delay={0} baseOpacity={0.55} />
        <GlowLayer color={vial.glowColors[1]} hovered={hovered} delay={0.7} baseOpacity={0.3} />
        <GlowLayer color={vial.glowColors[2]} hovered={hovered} delay={1.4} baseOpacity={0.22} />
        <Image
          src={vial.src}
          alt={vial.alt}
          width={vial.width}
          height={vial.height}
          style={{ width: vial.displayWidth, height: "auto" }}
          className="relative select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
          priority
        />
      </motion.div>
    </motion.div>
  );
}

export function HeroVialCluster() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md sm:h-[480px]">
      {vials.map((vial) => (
        <Vial key={vial.src} vial={vial} />
      ))}
    </div>
  );
}
