"use client";

import CategoryProductGrid from "./categoryProductGrid";
import type { StoreProduct } from "@/lib/store-products";

const HAIRCARE_PAGE_SIZE = 9;

export default function HaircareProductGrid({
  products,
}: {
  products: StoreProduct[];
}) {
  return (
    <CategoryProductGrid
      products={products}
      pageSize={HAIRCARE_PAGE_SIZE}
      basePath="/haircare"
    />
  );
}
