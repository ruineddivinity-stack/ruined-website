import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductScroller } from "@/components/product/ProductScroller";
import { getAllProducts } from "@/lib/woocommerce";

export async function BestSellers() {
  const products = await getAllProducts();
  const featured = [...products]
    .sort((a, b) => Number(b.inStock) - Number(a.inStock))
    .slice(0, 4);

  return (
    <section className="bg-black/65 py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Catalog" title="Bestselling research compounds" />
          <Button href="/shop" variant="secondary">
            View All Products
          </Button>
        </div>

        <div className="mt-10">
          <ProductScroller products={featured} />
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
