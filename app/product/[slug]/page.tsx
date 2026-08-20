import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { BundleContents } from "@/components/product/BundleContents";
import { getAllProducts, getProductBySlug } from "@/lib/woocommerce";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const badge = product.type === "bundle" ? "Bundle" : product.onSale ? "Sale" : null;

  return (
    <div className="py-20">
      <Container>
        <Link
          href="/shop"
          className="text-xs font-semibold uppercase tracking-widest text-fg-muted hover:text-fg"
        >
          &larr; Back to Shop
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="relative flex aspect-square items-center justify-center rounded-[2rem] border border-border bg-gradient-to-b from-surface-2 to-black bg-noise">
            {(badge || !product.inStock) && (
              <div className="absolute left-6 top-6 z-10 flex gap-2">
                {badge && (
                  <Badge tone={badge === "Bundle" ? "holo" : "steel"}>
                    {badge}
                  </Badge>
                )}
                {!product.inStock && <Badge tone="danger">Sold Out</Badge>}
              </div>
            )}
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
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

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
              {product.category}
            </p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-fg">
              {product.name}
            </h1>
            {product.shortDescription && (
              <p
                className="mt-4 text-sm leading-relaxed text-fg-muted [&_p]:mb-2"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            )}

            <div className="mt-6">
              <ProductPurchase
                slug={product.slug}
                price={product.price}
                regularPrice={product.regularPrice}
                onSale={product.onSale}
                inStock={product.inStock}
                variations={product.variations}
                showBulkOptions={product.type !== "bundle"}
              />
            </div>

            {product.bundledItems && product.bundledItems.length > 0 && (
              <div className="mt-8">
                <BundleContents items={product.bundledItems} />
              </div>
            )}

            <div className="mt-10 grid grid-cols-1 gap-3 border-t border-border-soft pt-8 sm:grid-cols-2">
              <Fact label="Category" value={product.category} />
              {product.size && <Fact label="Size" value={product.size} />}
              <Fact label="Availability" value={product.inStock ? "In stock" : "Out of stock"} />
              <Fact label="Use" value="Research only" />
            </div>

            {product.description && (
              <div
                className="prose-invert mt-8 text-xs leading-relaxed text-fg-faint [&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-fg-muted [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            <p className="mt-8 text-xs leading-relaxed text-fg-faint">
              For laboratory research and in-vitro use only. Not for human
              or animal consumption. Not evaluated by the FDA.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 px-4 py-3">
      <p className="text-[11px] uppercase tracking-widest text-fg-faint">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-fg">{value}</p>
    </div>
  );
}
