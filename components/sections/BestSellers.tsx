import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductScroller } from "@/components/product/ProductScroller";
import { Reveal } from "@/components/ui/Reveal";
import { getAllProducts } from "@/lib/woocommerce";

export async function BestSellers() {
  const products = await getAllProducts();
  const featured = [...products]
    .sort((a, b) => Number(b.inStock) - Number(a.inStock))
    .slice(0, 4);

  return (
    <section className="bg-[rgba(3,3,4,0.65)] py-24">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Catalog" title="Bestselling research compounds" />
            <Button href="/shop" variant="secondary">
              View All Products
            </Button>
          </div>
        </Reveal>

        <div className="mt-10">
          <ProductScroller products={featured} />
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
            {featured.map((product, i) => (
              <Reveal key={product.slug} delay={i * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
