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

        <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm leading-relaxed text-amber-200">
          <p className="font-semibold text-amber-100">A note on payment</p>
          <p className="mt-1.5">
            The payment processing industry is changing, and our card
            processor has been shut down.{" "}
            <span className="font-semibold text-amber-100">
              CashApp is currently the only accepted payment method.
            </span>{" "}
            We&rsquo;re working hard to get card payments back up and running
            &mdash; thanks for your patience in the meantime.
          </p>
        </div>

        <CheckoutClient products={products} />
      </Container>
    </div>
  );
}
