import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ShopClient } from "@/components/shop/ShopClient";
import { BundleTeaser } from "@/components/shop/BundleTeaser";
import { getAllProducts } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Shop | RUINED",
  description: "Browse the full RUINED catalog of research peptides and compounds.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="py-20">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
          Catalog
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-fg sm:text-5xl">
          Shop All Products
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted">
          Research-grade peptides and compounds, held to a strict internal
          purity standard. For laboratory and in-vitro research use only.
        </p>

        <div className="mt-6">
          <BundleTeaser />
        </div>

        <div className="mt-12">
          <ShopClient products={products} />
        </div>
      </Container>
    </div>
  );
}
