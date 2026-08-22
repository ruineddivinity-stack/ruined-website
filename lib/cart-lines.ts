import type { CartItem } from "./cart-context";
import type { Product, ProductVariation } from "./types";

export type CartLine = {
  product: Product;
  qty: number;
  variationId?: number;
  variation?: ProductVariation;
  unitPrice: number;
  unitRegularPrice: number;
  onSale: boolean;
  inStock: boolean;
  isGift: boolean;
  isBundlePick: boolean;
  bundleId?: string;
};

export function resolveCartLines(
  items: CartItem[],
  products: Product[],
): CartLine[] {
  return items
    .map((item): CartLine | null => {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) return null;

      const variation = item.variationId
        ? (product.variations?.find((v) => v.id === item.variationId) ??
          undefined)
        : undefined;

      return {
        product,
        qty: item.qty,
        variationId: item.variationId,
        variation,
        unitPrice: item.isGift ? 0 : variation ? variation.price : product.price,
        unitRegularPrice: variation
          ? variation.regularPrice
          : product.regularPrice,
        onSale: variation ? variation.onSale : product.onSale,
        inStock: variation ? variation.inStock : product.inStock,
        isGift: Boolean(item.isGift),
        isBundlePick: Boolean(item.isBundlePick),
        bundleId: item.bundleId,
      };
    })
    .filter((line): line is CartLine => line !== null);
}
