"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function HeaderEntrance({ children }: { children: ReactNode }) {
  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-gradient-to-b from-surface/80 via-surface/25 to-transparent px-4 pb-4 pt-3 sm:pt-4"
    >
      {children}
    </motion.header>
  );
}
