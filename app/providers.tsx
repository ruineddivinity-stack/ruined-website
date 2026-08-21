"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export function Providers({
  children,
  products,
}: {
  children: ReactNode;
  products: Product[];
}) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider products={products}>{children}</CartProvider>
    </MotionConfig>
  );
}
