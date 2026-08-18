import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getAllProducts } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Checkout | RUINED",
};

export default async function CheckoutPage() {
  const products = await getAllProducts();

  return (
    <div className="py-20">
      <Container>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-fg">
          Checkout
        </h1>
        <CheckoutClient products={products} />
      </Container>
    </div>
  );
}
