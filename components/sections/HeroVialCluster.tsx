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
    src: "/vial-mots-c-v3.png",
    width: 446,
    height: 726,
    alt: "RUINED RX MOTS-C 20MG",
    glowColors: [
      "var(--color-holo-violet)",
      "var(--color-holo-blue)",
      "var(--color-holo-pink)",
    ],
    className: "left-[2%] top-[32%]",
    displayWidth: 197,
    floatDuration: 4.6,
    floatDelay: 0,
    zIndex: 10,
  },
  {
    src: "/vial-tesa-v3.png",
    width: 402,
    height: 730,
    alt: "RUINED RX Tesamorelin 20MG",
    glowColors: [
      "var(--color-holo-blue)",
      "var(--color-holo-pink)",
      "var(--color-holo-gold)",
    ],
    className: "left-1/2 top-0 -translate-x-1/2",
    displayWidth: 176,
    floatDuration: 5.2,
    floatDelay: 0.4,
    zIndex: 20,
  },
  {
    src: "/vial-glp3-v3.png",
    width: 449,
    height: 689,
    alt: "RUINED RX GLP-3 50MG",
    glowColors: [
      "var(--color-holo-pink)",
      "var(--color-holo-gold)",
      "var(--color-holo-violet)",
    ],
    className: "right-[2%] top-[28%]",
    displayWidth: 209,
    floatDuration: 4.9,
    floatDelay: 0.8,
    zIndex: 10,
  },
];

const GLOW_CORE = "#f0eeff";

function EllipseGlow({
  color,
  inset,
  restBlur,
  restScale,
  restOpacity,
  hoverBlur,
  hoverScale,
  hoverOpacity,
  hovered,
  pulse,
  delay,
}: {
  color: string;
  inset: number;
  restBlur: number;
  restScale: number;
  restOpacity: number;
  hoverBlur: number;
  hoverScale: number;
  hoverOpacity: number;
  hovered: boolean;
  pulse?: boolean;
  delay?: number;
}) {
  const hoverAnimate = pulse
    ? {
        opacity: [hoverOpacity * 0.55, hoverOpacity, hoverOpacity * 0.55],
        scale: hoverScale,
        filter: `blur(${hoverBlur}px)`,
      }
    : { opacity: hoverOpacity, scale: hoverScale, filter: `blur(${hoverBlur}px)` };

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -z-10 rounded-full"
      style={{
        inset: `${inset}%`,
        background: `radial-gradient(ellipse at center, ${color} 0%, ${color} 35%, transparent 75%)`,
      }}
      animate={
        hovered
          ? hoverAnimate
          : { opacity: restOpacity, scale: restScale, filter: `blur(${restBlur}px)` }
      }
      transition={
        hovered && pulse
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
        <EllipseGlow
          color={GLOW_CORE}
          inset={15}
          restBlur={10}
          restScale={1}
          restOpacity={0.65}
          hoverBlur={22}
          hoverScale={1.18}
          hoverOpacity={0.95}
          hovered={hovered}
        />
        <EllipseGlow
          color={vial.glowColors[0]}
          inset={5}
          restBlur={16}
          restScale={1.04}
          restOpacity={0.55}
          hoverBlur={30}
          hoverScale={1.32}
          hoverOpacity={0.85}
          hovered={hovered}
          pulse
          delay={0}
        />
        <EllipseGlow
          color={vial.glowColors[1]}
          inset={-4}
          restBlur={20}
          restScale={1.08}
          restOpacity={0.35}
          hoverBlur={36}
          hoverScale={1.42}
          hoverOpacity={0.7}
          hovered={hovered}
          pulse
          delay={0.75}
        />
        <EllipseGlow
          color={vial.glowColors[2]}
          inset={-12}
          restBlur={24}
          restScale={1.12}
          restOpacity={0.24}
          hoverBlur={42}
          hoverScale={1.52}
          hoverOpacity={0.55}
          hovered={hovered}
          pulse
          delay={1.5}
        />
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
