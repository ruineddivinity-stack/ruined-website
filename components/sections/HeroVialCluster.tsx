"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const ringTransition = (duration: number, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: "easeInOut" as const,
});

function OrbitalRings() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-[-10%] z-20 [perspective:1000px]">
      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? undefined
            : {
                rotateZ: [-3, 4, -2, -3],
                rotateX: [57, 64, 54, 57],
                rotateY: [-8, 6, -5, -8],
                x: [0, 8, -5, 0],
                y: [0, -5, 4, 0],
              }
        }
        transition={ringTransition(3.4)}
      >
        <svg viewBox="0 0 760 560" className="h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="orbitalStrokeA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f5f7ff" stopOpacity="0.92" />
              <stop offset="18%" stopColor="#71dfff" stopOpacity="0.95" />
              <stop offset="41%" stopColor="#ee68e9" stopOpacity="0.96" />
              <stop offset="64%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="82%" stopColor="#f5b8ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8eeaff" stopOpacity="0.9" />
            </linearGradient>
            <filter id="orbitalSoftGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* rear halves */}
          <ellipse
            cx="380"
            cy="286"
            rx="286"
            ry="108"
            fill="none"
            stroke="url(#orbitalStrokeA)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="470 530"
            strokeDashoffset="15"
            opacity="0.68"
            filter="url(#orbitalSoftGlow)"
          />
          <ellipse
            cx="378"
            cy="284"
            rx="226"
            ry="166"
            fill="none"
            stroke="url(#orbitalStrokeA)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="410 580"
            strokeDashoffset="420"
            opacity="0.48"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? undefined
            : {
                rotateZ: [5, -4, 2, 5],
                rotateX: [62, 53, 66, 62],
                rotateY: [7, -6, 4, 7],
                x: [0, -7, 5, 0],
                y: [0, 4, -4, 0],
              }
        }
        transition={ringTransition(4.1, 0.15)}
      >
        <svg viewBox="0 0 760 560" className="h-full w-full overflow-visible" aria-hidden>
          <ellipse
            cx="380"
            cy="286"
            rx="306"
            ry="128"
            fill="none"
            stroke="url(#orbitalStrokeA)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="360 610"
            strokeDashoffset="350"
            opacity="0.72"
          />
        </svg>
      </motion.div>
    </div>
  );
}

function FrontRingArcs() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="pointer-events-none absolute inset-[-10%] z-40 [perspective:1000px]"
      animate={
        reduceMotion
          ? undefined
          : {
              rotateZ: [-3, 4, -2, -3],
              rotateX: [57, 64, 54, 57],
              rotateY: [-8, 6, -5, -8],
              x: [0, 8, -5, 0],
              y: [0, -5, 4, 0],
            }
      }
      transition={ringTransition(3.4)}
    >
      <svg viewBox="0 0 760 560" className="h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="orbitalStrokeFront" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="22%" stopColor="#88eaff" />
            <stop offset="49%" stopColor="#f78ce9" />
            <stop offset="72%" stopColor="#f6f7ff" />
            <stop offset="100%" stopColor="#9fe8ff" />
          </linearGradient>
          <filter id="frontGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse
          cx="380"
          cy="286"
          rx="286"
          ry="108"
          fill="none"
          stroke="url(#orbitalStrokeFront)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray="455 545"
          strokeDashoffset="510"
          opacity="0.96"
          filter="url(#frontGlow)"
        />
      </svg>
    </motion.div>
  );
}

export function HeroVialCluster() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[620px] sm:h-[470px] lg:h-[520px]">
      <div className="absolute inset-[8%] z-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,94,203,0.18),rgba(75,210,255,0.11)_34%,rgba(68,34,118,0.08)_54%,transparent_72%)] blur-2xl" />
      <div className="absolute left-[13%] top-[18%] h-[58%] w-[72%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.11),transparent_68%)] blur-xl" />

      <OrbitalRings />

      <motion.div
        className="absolute left-[12%] top-[27%] z-30 w-[26%]"
        animate={reduceMotion ? undefined : { y: [0, -7, 2, 0], rotate: [-1.5, -0.4, -1.8, -1.5] }}
        transition={ringTransition(3.2, 0.12)}
      >
        <Image
          src="/vial-mots-c-v3.png"
          alt="RUINED RX MOTS-C 20MG"
          width={446}
          height={726}
          className="h-auto w-full select-none drop-shadow-[0_24px_36px_rgba(0,0,0,0.72)]"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-[12%] z-30 w-[28%] -translate-x-1/2"
        animate={reduceMotion ? undefined : { y: [0, -10, 3, 0], rotate: [0.4, 1.1, 0.1, 0.4] }}
        transition={ringTransition(3.55)}
      >
        <Image
          src="/vial-tesa-v3.png"
          alt="RUINED RX Tesamorelin 20MG"
          width={402}
          height={730}
          className="h-auto w-full select-none drop-shadow-[0_28px_44px_rgba(0,0,0,0.78)]"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute right-[10%] top-[25%] z-30 w-[28%]"
        animate={reduceMotion ? undefined : { y: [0, -6, 4, 0], rotate: [1.5, 0.5, 1.8, 1.5] }}
        transition={ringTransition(3.0, 0.2)}
      >
        <Image
          src="/vial-glp3-v3.png"
          alt="RUINED RX GLP-3 50MG"
          width={449}
          height={689}
          className="h-auto w-full select-none drop-shadow-[0_24px_36px_rgba(0,0,0,0.72)]"
          priority
        />
      </motion.div>

      <FrontRingArcs />

      <div className="pointer-events-none absolute inset-x-[10%] bottom-[3%] z-50 h-[24%] bg-gradient-to-t from-[#050507] via-[#050507]/50 to-transparent opacity-65 blur-[1px]" />
    </div>
  );
}
