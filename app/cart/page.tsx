import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CartClient } from "@/components/cart/CartClient";
import { getAllProducts } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Cart | RUINED",
};

export default async function CartPage() {
  const products = await getAllProducts();

  return (
    <div className="py-20">
      <Container>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-fg">
          Your Cart
        </h1>
        <CartClient products={products} />
      </Container>
    </div>
  );
}
