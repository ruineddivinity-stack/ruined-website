"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart, type BundlePick } from "@/lib/cart-context";
import type { Product } from "@/lib/types";
import { BUNDLE_DISCOUNT_RATE, BUNDLE_VIAL_COUNT } from "@/lib/discounts";

type Pick = BundlePick & { price: number; name: string; image: string | null };

export function BundleBuilderClient({ products }: { products: Product[] }) {
  const { addBundle } = useCart();
  const router = useRouter();
  const [selected, setSelected] = useState<Pick[]>([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  // One-way: once they've scrolled far enough to reach the real summary
  // panel, the sticky bar is done for good — it doesn't reappear if they
  // scroll back up to keep browsing.
  const [summaryReached, setSummaryReached] = useState(false);

  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSummaryReached(true);
      },
      { rootMargin: "0px 0px -1px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // A product can belong to more than one WooCommerce category — filter by
  // the full list, not just its primary one, so e.g. a "Blends" product
  // tagged "Growth Hormones" too still shows up under both.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.flatMap((p) => p.categories)))],
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.categories.includes(category);
      const matchesQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, category, query]);

  const isFull = selected.length >= BUNDLE_VIAL_COUNT;

  const toggle = (
    slug: string,
    name: string,
    price: number,
    image: string | null,
    variationId?: number,
    variationLabel?: string,
  ) => {
    setSelected((prev) => {
      const key = `${slug}:${variationId ?? ""}`;
      const exists = prev.some((p) => `${p.slug}:${p.variationId ?? ""}` === key);
      if (exists) {
        return prev.filter((p) => `${p.slug}:${p.variationId ?? ""}` !== key);
      }
      const withoutSameProduct = prev.filter((p) => p.slug !== slug);
      if (withoutSameProduct.length >= BUNDLE_VIAL_COUNT) return prev;
      return [...withoutSameProduct, { slug, variationId, variationLabel, price, name, image }];
    });
  };

  const scrollToSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const remove = (slug: string, variationId?: number) => {
    setSelected((prev) =>
      prev.filter((p) => !(p.slug === slug && p.variationId === variationId)),
    );
  };

  const subtotal = selected.reduce((sum, p) => sum + p.price, 0);
  const discountAmount = subtotal * BUNDLE_DISCOUNT_RATE;
  const bundlePrice = subtotal - discountAmount;

  const handleAdd = () => {
    if (selected.length !== BUNDLE_VIAL_COUNT) return;
    addBundle(selected.map(({ slug, variationId, variationLabel }) => ({ slug, variationId, variationLabel })));
    router.push("/cart");
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-10 pb-24 md:pb-0 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="relative max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vials..."
            aria-label="Search vials"
            className="w-full rounded-full border border-border bg-surface py-3 pl-4 pr-4 text-sm text-fg placeholder:text-fg-faint transition-colors focus:border-steel-500 focus:outline-none"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                category === cat
                  ? "border-steel-500 bg-steel-700/30 text-fg"
                  : "border-border text-fg-muted hover:border-steel-500/50 hover:text-fg"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <BundleCard
              key={product.slug}
              product={product}
              selected={selected}
              disabled={isFull}
              onToggle={toggle}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-sm text-fg-muted">No vials match your search.</p>
        )}
      </div>

      <div ref={summaryRef} className="h-fit rounded-2xl border border-border bg-surface/60 p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-black uppercase tracking-wide text-fg">
          Your Bundle
        </h2>
        <p className="mt-1 text-xs text-fg-muted">
          {selected.length} of {BUNDLE_VIAL_COUNT} vials selected
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {Array.from({ length: BUNDLE_VIAL_COUNT }).map((_, i) => {
            const pick = selected[i];
            if (!pick) {
              return (
                <div
                  key={i}
                  className="flex h-14 items-center justify-center rounded-xl border border-dashed border-border text-xs text-fg-faint"
                >
                  Pick a vial
                </div>
              );
            }
            return (
              <div
                key={`${pick.slug}:${pick.variationId ?? "base"}`}
                className="flex items-center gap-3 rounded-xl border border-steel-500/40 bg-steel-700/10 px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-fg">{pick.name}</p>
                  {pick.variationLabel && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-steel-300">
                      {pick.variationLabel}
                    </span>
                  )}
                </div>
                <span className="shrink-0 text-xs text-fg-muted">${pick.price.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => remove(pick.slug, pick.variationId)}
                  aria-label={`Remove ${pick.name}`}
                  className="shrink-0 text-fg-faint hover:text-danger"
                >
                  <CloseIcon />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3.5 py-3 text-xs text-emerald-300">
          🎁 Free BAC Water (10ml) included
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-steel-500/30 bg-steel-700/10 px-3.5 py-3 text-xs text-steel-300">
          🚚 Free shipping on this bundle
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-fg-faint">
          Affiliate codes and other discounts don&rsquo;t apply to bundles —
          it&rsquo;s already {BUNDLE_DISCOUNT_RATE * 100}% off, on its own.
          It also won&rsquo;t count toward the site&rsquo;s other gift-tier
          rewards — your free BAC Water here is already included.
        </p>

        <div className="mt-5 flex flex-col gap-1.5 border-t border-border-soft pt-5 text-sm">
          <div className="flex justify-between text-fg-muted">
            <span>Subtotal</span>
            <span className="text-fg">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-steel-300">
            <span>Bundle discount ({BUNDLE_DISCOUNT_RATE * 100}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-3 flex justify-between border-t border-border-soft pt-3 text-base font-semibold text-fg">
          <span>Bundle Price</span>
          <span>${bundlePrice.toFixed(2)}</span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={selected.length !== BUNDLE_VIAL_COUNT}
          className="btn-shimmer mt-6 flex w-full items-center justify-center rounded-full bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 px-6 py-3 text-sm font-semibold text-black transition-transform hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
        >
          {selected.length === BUNDLE_VIAL_COUNT
            ? "Add Bundle to Cart"
            : `Pick ${BUNDLE_VIAL_COUNT - selected.length} more`}
        </button>
      </div>
      </div>

      {!summaryReached && (
        <button
          type="button"
          onClick={scrollToSummary}
          aria-label="View your bundle"
          className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-2xl border border-steel-500/40 bg-surface-2/95 px-4 py-3.5 shadow-[0_0_24px_2px_rgba(140,82,199,0.35)] backdrop-blur-xl md:hidden"
        >
          <div className="flex -space-x-3">
            {Array.from({ length: BUNDLE_VIAL_COUNT }).map((_, i) => {
              const pick = selected[i];
              return (
                <span
                  key={i}
                  className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-surface-2 bg-surface-3"
                >
                  {pick?.image ? (
                    <Image src={pick.image} alt={pick.name} width={36} height={36} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-[9px] text-fg-faint">{pick ? "🧪" : ""}</span>
                  )}
                </span>
              );
            })}
          </div>
          <span className="flex-1 text-left">
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-fg-faint">
              {selected.length} of {BUNDLE_VIAL_COUNT} selected
            </span>
            <span className="block text-sm font-bold text-fg">${bundlePrice.toFixed(2)}</span>
          </span>
          <span className="flex h-9 items-center justify-center rounded-full bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 px-4 text-xs font-bold uppercase tracking-wide text-black">
            {selected.length === BUNDLE_VIAL_COUNT ? "Review" : "View Bundle"}
          </span>
        </button>
      )}
    </>
  );
}

function BundleCard({
  product,
  selected,
  disabled,
  onToggle,
}: {
  product: Product;
  selected: Pick[];
  disabled: boolean;
  onToggle: (
    slug: string,
    name: string,
    price: number,
    image: string | null,
    variationId?: number,
    variationLabel?: string,
  ) => void;
}) {
  const hasVariations = !!product.variations && product.variations.length > 0;
  const selectedVariationId = selected.find((s) => s.slug === product.slug)?.variationId;
  const isSelectedNoVariation = selected.some((s) => s.slug === product.slug && !hasVariations);
  const cardDisabled = disabled && !selected.some((s) => s.slug === product.slug);

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border p-4 transition-colors ${
        isSelectedNoVariation
          ? "border-steel-500 bg-steel-700/15"
          : "border-border bg-surface/60"
      } ${cardDisabled ? "opacity-40" : ""}`}
    >
      <div className="flex items-center gap-3">
        {product.image ? (
          <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#eef1f3]">
            <Image src={product.image} alt={product.name} fill className="object-contain p-1" sizes="44px" />
          </div>
        ) : (
          <div className="h-14 w-11 shrink-0 rounded-lg border border-chrome-500/30 bg-gradient-to-b from-surface-3 to-surface" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-fg">{product.name}</p>
          <p className="text-[11px] uppercase tracking-wide text-fg-faint">{product.category}</p>
        </div>
      </div>

      {!product.inStock ? (
        <span className="rounded-full border border-danger/40 bg-danger/10 px-3 py-1.5 text-center text-[11px] font-semibold text-danger">
          Sold Out
        </span>
      ) : hasVariations ? (
        <div className="flex flex-wrap gap-1.5">
          {product.variations!.map((v) => {
            const isSelected = selectedVariationId === v.id;
            const isDisabled = !v.inStock || (disabled && !isSelected);
            return (
              <button
                key={v.id}
                type="button"
                disabled={isDisabled}
                onClick={() => onToggle(product.slug, product.name, v.price, product.image, v.id, v.label)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  isSelected
                    ? "border-steel-500 bg-steel-500 text-black"
                    : "border-steel-500/50 bg-steel-700/25 text-steel-300 hover:border-steel-400"
                }`}
              >
                {v.label} · ${v.price.toFixed(2)}
              </button>
            );
          })}
        </div>
      ) : (
        <button
          type="button"
          disabled={cardDisabled}
          onClick={() => onToggle(product.slug, product.name, product.price, product.image)}
          className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
            isSelectedNoVariation
              ? "border-steel-500 bg-steel-500 text-black"
              : "border-border text-fg hover:border-steel-500/50"
          }`}
        >
          {isSelectedNoVariation ? "✓ Selected" : `Select · $${product.price.toFixed(2)}`}
        </button>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
