"use client";

import CategoryProductGrid from "./categoryProductGrid";
import type { StoreProduct } from "@/lib/store-products";

const MAKEUP_PAGE_SIZE = 9;

export default function MakeupProductGrid({
  products,
}: {
  products: StoreProduct[];
}) {
  return (
    <CategoryProductGrid
      products={products}
      pageSize={MAKEUP_PAGE_SIZE}
      basePath="/makeup"
    />
  );
}
