"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { useProductVariant } from "@/lib/product-variant-context";
import { isBackInStock } from "@/lib/back-in-stock";
import type { Product } from "@/lib/types";

export function ProductImage({
  product,
  badge,
}: {
  product: Product;
  badge: "Bundle" | "Sale" | null;
}) {
  const { selected } = useProductVariant();
  const image = selected?.image ?? product.image;
  const inStock = selected ? selected.inStock : product.inStock;
  const backInStock = isBackInStock(product.slug);

  return (
    <div className="relative flex aspect-square items-center justify-center rounded-[2rem] border border-border bg-gradient-to-b from-surface-2 to-black bg-noise">
      {(badge || !inStock || backInStock) && (
        <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-2">
          {badge && (
            <Badge tone={badge === "Bundle" ? "holo" : "steel"}>
              {badge}
            </Badge>
          )}
          {!inStock && <Badge tone="danger">Sold Out</Badge>}
          {backInStock && inStock && (
            <Badge tone="success">Back in Stock</Badge>
          )}
        </div>
      )}
      {image ? (
        <Image
          src={image}
          alt={product.name}
          fill
          priority
          className="rounded-[2rem] object-cover"
          sizes="(min-width: 1024px) 40vw, 90vw"
        />
      ) : (
        <div className="flex h-56 w-36 items-center justify-center rounded-xl border border-chrome-500/30 bg-gradient-to-b from-surface-3 to-surface">
          <span className="font-display text-sm font-semibold tracking-widest text-gradient-holo">
            RUINED
          </span>
        </div>
      )}
    </div>
  );
}
