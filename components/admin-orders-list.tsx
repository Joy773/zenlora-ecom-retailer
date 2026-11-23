import type { AdminOrder } from "@/lib/store-orders";

function formatMoney(amount: number) {
  return `৳${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(amount)}`;
}

function orderDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(new Date(value));
}

function statusClassName(status: string) {
  if (status === "delivered") return "bg-green-100 text-green-800";
  if (status === "cancelled") return "bg-red-100 text-red-800";
  if (status === "pending") return "bg-amber-100 text-amber-800";
  return "bg-primary/50 text-foreground/75";
}

export default function AdminOrdersList({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-primary bg-white p-8 text-center">
        <p className="text-sm font-medium text-foreground">No orders yet</p>
        <p className="mt-2 text-sm text-foreground/55">
          Confirmed customer orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {orders.map((order) => (
        <article
          key={order.orderNumber}
          className="rounded-xl border border-primary bg-white p-5 md:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/70 pb-4">
            <div>
              <h2 className="font-semibold text-foreground">{order.orderNumber}</h2>
              <p className="mt-1 text-xs text-foreground/55">
                {orderDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClassName(order.status)}`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid gap-5 py-5 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.7fr)]">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {order.deliveryDetails.fullName}
              </h3>
              <p className="mt-1 text-sm text-foreground/70">
                {order.deliveryDetails.contact}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {order.deliveryDetails.address}, {order.deliveryDetails.city}{" "}
                {order.deliveryDetails.zipCode}
              </p>
            </div>

            <ul className="space-y-2 text-sm">
              {order.items.map((item, index) => (
                <li
                  key={`${order.orderNumber}-${index}`}
                  className="flex justify-between gap-4"
                >
                  <span className="min-w-0 text-foreground/70">
                    {item.productName}
                    {item.variantSize ? ` · ${item.variantSize}` : ""} × {item.quantity}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatMoney(item.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap justify-end gap-x-6 gap-y-2 border-t border-primary/70 pt-4 text-sm">
            <span className="text-foreground/60">
              Subtotal {formatMoney(order.subtotal)}
            </span>
            <span className="text-foreground/60">
              Delivery {formatMoney(order.deliveryFee)}
            </span>
            <span className="font-semibold text-foreground">
              Total {formatMoney(order.total)}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
