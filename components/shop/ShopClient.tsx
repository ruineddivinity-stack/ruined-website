"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export function ShopClient({ products }: { products: Product[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              active === cat
                ? "border-steel-500 bg-steel-700/30 text-fg"
                : "border-border text-fg-muted hover:border-steel-500/50 hover:text-fg"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product, i) => (
          <Reveal key={product.slug} delay={(i % 4) * 0.06} y={16}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-fg-muted">
          No products in this category yet.
        </p>
      )}
    </div>
  );
}
