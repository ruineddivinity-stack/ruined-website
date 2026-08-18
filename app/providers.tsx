"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/lib/cart-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>{children}</CartProvider>
    </MotionConfig>
  );
}
