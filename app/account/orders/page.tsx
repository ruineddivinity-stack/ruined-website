import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getCustomerOrders } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Orders | RUINED",
};

const STATUS_TONE: Record<string, string> = {
  completed: "bg-steel-700/30 text-steel-300 border-steel-600/50",
  processing: "bg-steel-700/30 text-steel-300 border-steel-600/50",
  "on-hold": "bg-chrome-700/30 text-chrome-300 border-chrome-500/40",
  pending: "bg-chrome-700/30 text-chrome-300 border-chrome-500/40",
  cancelled: "bg-danger/15 text-danger border-danger/40",
  refunded: "bg-danger/15 text-danger border-danger/40",
  failed: "bg-danger/15 text-danger border-danger/40",
};

export default async function OrdersPage() {
  const session = await getSession();
  const orders = session ? await getCustomerOrders(session.id) : [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface/60 px-8 py-16 text-center">
        <p className="text-sm text-fg-muted">
          You haven&rsquo;t placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-2xl border border-border bg-surface/60 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-fg">
                Order #{order.number}
              </p>
              <p className="text-xs text-fg-faint">
                {new Date(order.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
                  STATUS_TONE[order.status] ??
                  "border-border text-fg-muted"
                }`}
              >
                {order.status.replace("-", " ")}
              </span>
              <p className="text-sm font-semibold text-fg">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1.5 border-t border-border-soft pt-4">
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
        </div>
      ))}
    </div>
  );
}
