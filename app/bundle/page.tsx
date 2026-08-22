import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BundleBuilderClient } from "@/components/bundle/BundleBuilderClient";
import { getAllProducts } from "@/lib/woocommerce";
import { isBundleEligible } from "@/lib/bundle";
import { BUNDLE_DISCOUNT_RATE, BUNDLE_VIAL_COUNT } from "@/lib/discounts";

export const metadata: Metadata = {
  title: "Build a Bundle | RUINED",
  description: `Pick any ${BUNDLE_VIAL_COUNT} vials and get ${BUNDLE_DISCOUNT_RATE * 100}% off plus a free BAC water.`,
};

export default async function BundlePage() {
  const products = await getAllProducts();
  const eligible = products.filter(isBundleEligible);

  return (
    <div className="py-16">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
          Build a Bundle
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-fg sm:text-5xl">
          Pick Any {BUNDLE_VIAL_COUNT}, Get {BUNDLE_DISCOUNT_RATE * 100}% Off
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted">
          Choose any {BUNDLE_VIAL_COUNT} vials from the catalog — we&rsquo;ll
          knock {BUNDLE_DISCOUNT_RATE * 100}% off all of them and throw in a
          free BAC Water, on us. Free shipping too.
        </p>

        <div className="mt-10">
          <BundleBuilderClient products={eligible} />
        </div>
      </Container>
    </div>
  );
}
