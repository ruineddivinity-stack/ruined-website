"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export function ShopClient({ products }: { products: Product[] }) {
  // A product can belong to more than one WooCommerce category — filter by
  // the full list, not just its primary one, so e.g. a "Blends" product
  // tagged "Growth Hormones" too still shows up under both.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.flatMap((p) => p.categories)))],
    [products],
  );
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = active === "All" || p.categories.includes(active);
      const matchesQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, active, query]);

  return (
    <div>
      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the catalog..."
          aria-label="Search products"
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-11 text-sm text-fg placeholder:text-fg-faint transition-colors focus:border-steel-500 focus:outline-none"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-fg-faint transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
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

      {query.trim().length > 0 && (
        <p className="mt-6 text-xs uppercase tracking-widest text-fg-faint">
          {filtered.length} result{filtered.length === 1 ? "" : "s"} for &ldquo;
          {query.trim()}&rdquo;
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product, i) => (
          <Reveal key={product.slug} delay={(i % 4) * 0.06} y={16}>
            <ProductCard product={product} priority={i < 4} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-fg-muted">
          {query.trim().length > 0
            ? "No products match your search."
            : "No products in this category yet."}
        </p>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
