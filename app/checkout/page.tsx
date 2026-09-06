import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { SecureCheckoutLoadingWatcher } from "@/components/checkout/SecureCheckoutLoadingWatcher";
import { getAllProducts } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Checkout | RUINED",
};

export default async function CheckoutPage() {
  const products = await getAllProducts();

  return (
    <div className="py-20">
      <SecureCheckoutLoadingWatcher />
      <Container>
        <h1 className="font-display text-4xl font-black uppercase tracking-tight text-fg">
          Checkout
        </h1>

        <div className="mt-6 rounded-2xl border border-steel-500/35 bg-steel-700/10 px-5 py-4 text-sm leading-relaxed text-fg-muted">
          <p className="font-semibold text-fg">Secure payment</p>
          <p className="mt-1.5">
            Credit and debit card checkout is available through our secure
            sister-company payment flow. CashApp remains available as an
            alternate payment method.
          </p>
        </div>

        <CheckoutClient products={products} />
      </Container>
    </div>
  );
}
