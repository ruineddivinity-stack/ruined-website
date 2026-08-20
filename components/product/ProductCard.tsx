import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { QuickAddButton } from "@/components/product/QuickAddButton";
import { isBackInStock } from "@/lib/back-in-stock";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const badge = product.type === "bundle" ? "Bundle" : product.onSale ? "Sale" : null;
  const hasVariations = !!product.variations && product.variations.length > 0;
  const backInStock = isBackInStock(product.slug);

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-[0_0_28px_2px_rgba(31,200,221,0.28)]">
      <Link
        href={`/product/${product.slug}`}
        className="absolute inset-0 z-0"
        aria-label={product.name}
      />

      <div className="pointer-events-none relative z-[1] flex aspect-square items-center justify-center bg-gradient-to-b from-surface-2 to-black bg-noise">
        {(badge || !product.inStock || backInStock) && (
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            {badge && (
              <Badge tone={badge === "Bundle" ? "holo" : "steel"}>{badge}</Badge>
            )}
            {!product.inStock && <Badge tone="danger">Sold Out</Badge>}
            {backInStock && product.inStock && (
              <Badge tone="success">Back in Stock</Badge>
            )}
          </div>
        )}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        ) : (
          <div className="flex h-32 w-20 items-center justify-center rounded-lg border border-chrome-500/30 bg-gradient-to-b from-surface-3 to-surface">
            <span className="font-display text-[10px] font-semibold tracking-widest text-gradient-holo">
              RUINED
            </span>
          </div>
        )}
      </div>

      <div className="pointer-events-none flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-faint">
          {product.category}
        </p>
        <h3 className="mt-1 text-base font-semibold text-fg">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
            Research Use Only
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {hasVariations && (
              <span className="text-xs font-semibold text-fg-faint">From</span>
            )}
            <span className="font-display text-lg font-semibold text-fg">
              ${product.price.toFixed(2)}
            </span>
            {product.onSale && (
              <span className="text-sm text-fg-faint line-through">
                ${product.regularPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.size && (
            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-fg-faint">
              {product.size}
            </span>
          )}
        </div>

        {hasVariations && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.variations?.map((v) => (
              <span
                key={v.id}
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  v.inStock
                    ? "border-steel-500/50 bg-steel-700/25 text-steel-300"
                    : "border-border text-fg-faint opacity-50"
                }`}
              >
                {v.label}
              </span>
            ))}
          </div>
        )}

        <div className="pointer-events-auto mt-4">
          <QuickAddButton
            slug={product.slug}
            disabled={!product.inStock}
            hasVariations={!!product.variations && product.variations.length > 0}
          />
        </div>
      </div>
    </div>
  );
}
