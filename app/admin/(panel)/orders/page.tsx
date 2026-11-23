import AdminOrdersList from "@/components/admin-orders-list";
import { getAdminOrders } from "@/lib/store-orders";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <section className="px-5 py-8 md:px-12 md:py-10 lg:px-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-normal italic text-foreground md:text-5xl">
            Orders
          </h1>
          <p className="mt-4 text-[13px] leading-relaxed text-foreground/60">
            Review recent customer orders and delivery details.
          </p>
        </div>
        <p className="text-sm text-foreground/55">
          Showing the latest {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>
      <AdminOrdersList orders={orders} />
    </section>
  );
}
