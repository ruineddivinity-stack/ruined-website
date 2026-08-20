// Product slugs to flag with a "Back in Stock" badge — update as needed
// when a product comes back after being sold out.
const BACK_IN_STOCK_SLUGS = new Set(["glp-3-rt", "tesa"]);

export function isBackInStock(slug: string): boolean {
  return BACK_IN_STOCK_SLUGS.has(slug);
}
