import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getOrder } from "@/lib/woocommerce";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";
import { CASHAPP_TAG } from "@/lib/discounts";

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
  const isAwaitingCashApp = !isPaid && order.paymentMethod === "cashapp_manual";

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
            {isPaid
              ? "Order Confirmed"
              : isAwaitingCashApp
                ? "Order Placed — Awaiting Payment"
                : "Confirming Your Payment"}
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            {isPaid
              ? `Thanks for your order — a confirmation has been sent to your email.`
              : isAwaitingCashApp
                ? "Send your payment via CashApp using the details below — we'll confirm it and get your order moving."
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

          {isAwaitingCashApp && (
            <div className="mt-6 rounded-2xl border border-steel-600/50 bg-steel-700/15 px-5 py-4 text-left text-sm leading-relaxed text-fg">
              <p className="font-semibold">Send payment via CashApp</p>
              <p className="mt-1.5 text-fg-muted">
                Send{" "}
                <span className="font-semibold text-fg">
                  ${order.total.toFixed(2)}
                </span>{" "}
                to <span className="font-semibold text-fg">{CASHAPP_TAG}</span>{" "}
                and put{" "}
                <span className="font-semibold text-fg">
                  Order #{order.number}
                </span>{" "}
                in the payment note. Your order ships once we&rsquo;ve
                confirmed the payment.
              </p>
            </div>
          )}

          {order.isPickup && (
            <div className="mt-6 rounded-2xl border border-steel-600/50 bg-steel-700/15 px-5 py-4 text-left">
              <p className="text-sm font-semibold text-fg">Pickup Hours</p>
              <div className="mt-3 flex flex-col gap-1.5 text-xs text-fg-muted">
                <div className="flex justify-between">
                  <span>Houston</span>
                  <span className="font-semibold text-fg">
                    10AM–1PM, 6PM–9PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>San Antonio</span>
                  <span className="font-semibold text-fg">5PM–10PM</span>
                </div>
              </div>
            </div>
          )}

          {order.isPickup && (
            <div className="mt-4 rounded-2xl border border-border-soft bg-surface px-5 py-4 text-left">
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
