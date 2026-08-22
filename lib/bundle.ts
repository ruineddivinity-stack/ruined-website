import type { Product } from "./types";
import { BUNDLE_FREE_ITEM_SLUG } from "./discounts";

/** A "vial" the customer can pick into a bundle: any simple or variable
 * product (variable ones let them pick a dose in the builder itself) that
 * isn't the reconstitution diluent (that's the free 5th item, not a pickable
 * slot) and isn't a pre-built WooCommerce bundle/kit product. */
export function isBundleEligible(product: Product): boolean {
  return (
    (product.type === "simple" || product.type === "variable") &&
    product.slug !== BUNDLE_FREE_ITEM_SLUG &&
    !product.categories.includes("Reconstitution")
  );
}
