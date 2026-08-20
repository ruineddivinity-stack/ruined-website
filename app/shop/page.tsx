import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ShopClient } from "@/components/shop/ShopClient";
import { Badge } from "@/components/ui/Badge";
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
          <Badge tone="holo">
            <span className="flex items-center gap-1.5">
              <BundleIcon />
              Build a Bundle for 25% Off — Coming Soon
            </span>
          </Badge>
          <BundleTeaser />
        </div>

        <div className="mt-12">
          <ShopClient products={products} />
        </div>
      </Container>
    </div>
  );
}

function BundleIcon() {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8" />
      <path d="M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8" />
    </svg>
  );
}
