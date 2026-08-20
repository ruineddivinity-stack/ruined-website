"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { ProductVariation } from "./types";

type ProductVariantContextValue = {
  selected: ProductVariation | null;
  setSelected: (variation: ProductVariation) => void;
};

const ProductVariantContext =
  createContext<ProductVariantContextValue | null>(null);

export function ProductVariantProvider({
  variations,
  children,
}: {
  variations: ProductVariation[] | null;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const requestedMg = searchParams.get("mg");

  const [selected, setSelected] = useState<ProductVariation | null>(() => {
    if (!variations || variations.length === 0) return null;
    const requested = requestedMg
      ? variations.find(
          (v) => v.label.toLowerCase() === requestedMg.toLowerCase(),
        )
      : null;
    return requested ?? variations.find((v) => v.inStock) ?? variations[0];
  });

  return (
    <ProductVariantContext.Provider value={{ selected, setSelected }}>
      {children}
    </ProductVariantContext.Provider>
  );
}

export function useProductVariant() {
  const ctx = useContext(ProductVariantContext);
  if (!ctx) {
    throw new Error(
      "useProductVariant must be used within a ProductVariantProvider",
    );
  }
  return ctx;
}
