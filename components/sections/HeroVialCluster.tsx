"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const VIAL_MASK =
  "radial-gradient(ellipse 62% 68% at 50% 48%, black 58%, transparent 100%)";

type Vial = {
  src: string;
  width: number;
  height: number;
  alt: string;
  glow: string;
  className: string;
  displayWidth: number;
  floatDuration: number;
  floatDelay: number;
  zIndex: number;
};

const vials: Vial[] = [
  {
    src: "/vial-mots-c.png",
    width: 540,
    height: 730,
    alt: "RUINED RX MOTS-C 20MG",
    glow: "var(--color-holo-violet)",
    className: "left-[2%] top-[30%]",
    displayWidth: 168,
    floatDuration: 4.6,
    floatDelay: 0,
    zIndex: 10,
  },
  {
    src: "/vial-tesa.png",
    width: 480,
    height: 780,
    alt: "RUINED RX Tesamorelin 20MG",
    glow: "var(--color-holo-blue)",
    className: "left-1/2 top-0 -translate-x-1/2",
    displayWidth: 190,
    floatDuration: 5.2,
    floatDelay: 0.4,
    zIndex: 20,
  },
  {
    src: "/vial-klow.png",
    width: 540,
    height: 730,
    alt: "RUINED RX KLOW 80MG",
    glow: "var(--color-holo-pink)",
    className: "right-[2%] top-[26%]",
    displayWidth: 168,
    floatDuration: 4.9,
    floatDelay: 0.8,
    zIndex: 10,
  },
];

export function HeroVialCluster() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md sm:h-[480px]">
      {vials.map((vial) => (
        <motion.div
          key={vial.src}
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
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-3xl"
              style={{
                background: vial.glow,
                opacity: 0.65,
                transform: "scale(1.3)",
              }}
            />
            <Image
              src={vial.src}
              alt={vial.alt}
              width={vial.width}
              height={vial.height}
              style={{
                width: vial.displayWidth,
                height: "auto",
                WebkitMaskImage: VIAL_MASK,
                maskImage: VIAL_MASK,
              }}
              className="select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
              priority
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
