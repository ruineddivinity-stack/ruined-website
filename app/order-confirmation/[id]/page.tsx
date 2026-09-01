import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getOrder } from "@/lib/woocommerce";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";

export const metadata: Metadata = {
  title: "Order Confirmed | RUINED",
};

const PAID_STATUSES = new Set(["processing", "completed"]);

export default async function OrderConfirmationPage(
  props: PageProps<"/order-confirmation/[id]">,
) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const key = typeof searchParams.key === "string" ? searchParams.key : "";

  const orderId = Number.parseInt(id, 10);
  const order = Number.isFinite(orderId) ? await getOrder(orderId) : null;

  if (!order || !key || order.orderKey !== key) {
    notFound();
  }

  const isPaid = PAID_STATUSES.has(order.status);

  return (
    <div className="py-20">
      <ClearCartOnMount />
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-surface/60 p-8 text-center">
          <span
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
              isPaid
                ? "bg-steel-700/30 text-steel-300"
                : "bg-chrome-700/30 text-chrome-300"
            }`}
          >
            {isPaid ? "✓" : "…"}
          </span>

          <h1 className="mt-5 font-display text-2xl font-black uppercase tracking-tight text-fg">
            {isPaid ? "Order Confirmed" : "Confirming Your Payment"}
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            {isPaid
              ? `Thanks for your order — a confirmation has been sent to your email.`
              : "We're confirming your order. This page will update shortly — feel free to refresh."}
          </p>

          <div className="mt-6 flex flex-col gap-1.5 rounded-2xl border border-border-soft bg-surface px-5 py-4 text-left">
            {order.lineItems.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-xs text-fg-muted"
              >
                <span>
                  {item.name} &times; {item.quantity}
                </span>
                <span className="text-fg-faint">${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-border-soft pt-4 text-sm font-semibold text-fg">
            <span>Order #{order.number}</span>
            <span>${order.total.toFixed(2)}</span>
          </div>

          {order.isPickup && (
            <div className="mt-6 rounded-2xl border border-border-soft bg-surface px-5 py-4 text-left">
              <p className="text-sm font-semibold text-fg">
                Have questions about your pickup?
              </p>
              <div className="mt-3 flex flex-col gap-1.5 text-xs text-fg-muted">
                <div className="flex justify-between">
                  <span>Email</span>
                  <a
                    href="mailto:support@ruinedrx.com"
                    className="text-steel-300 hover:text-steel-200"
                  >
                    support@ruinedrx.com
                  </a>
                </div>
                <div className="flex justify-between">
                  <span>Phone</span>
                  <a
                    href="tel:+12108021229"
                    className="text-steel-300 hover:text-steel-200"
                  >
                    (210) 802-1229
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/shop">Continue Shopping</Button>
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-fg-muted transition hover:border-steel-500 hover:text-fg"
            >
              View Order History
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
