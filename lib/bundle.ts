import type { Product } from "./types";
import { BUNDLE_FREE_ITEM_SLUG } from "./discounts";

/** A "vial" the customer can pick into a bundle: any simple product that
 * isn't the reconstitution diluent itself (that's the free 5th item, not a
 * pickable slot) and isn't a pre-built WooCommerce bundle/kit product. */
export function isBundleEligible(product: Product): boolean {
  return (
    product.type === "simple" &&
    product.slug !== BUNDLE_FREE_ITEM_SLUG &&
    !product.categories.includes("Reconstitution")
  );
}
