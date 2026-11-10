import { Suspense } from "react";
import AddProductAction from "@/components/AddProductModal";
import AdminCategory from "@/components/admin-category";
import AdminProductsList from "@/components/admin-products-list";
import AdminSearchbar from "@/components/admin-searchbar";

export default function AdminProductsPage() {
  return (
    <section className="px-8 py-10 md:px-12 lg:px-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-normal italic text-foreground md:text-5xl">
            Products
          </h1>
          <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-foreground/60">
            Add, edit, and organize store products.
          </p>
        </div>
        <AddProductAction />
      </div>
      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <Suspense fallback={null}>
          <AdminSearchbar />
        </Suspense>
        <Suspense fallback={null}>
          <AdminCategory />
        </Suspense>
      </div>
      <AdminProductsList />
    </section>
  );
}
