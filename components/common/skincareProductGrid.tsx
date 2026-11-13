"use client";

import CategoryProductGrid from "./categoryProductGrid";
import type { StoreProduct } from "@/lib/store-products";

const SKINCARE_PAGE_SIZE = 9;

export default function SkincareProductGrid({
  products,
}: {
  products: StoreProduct[];
}) {
  return (
    <CategoryProductGrid
      products={products}
      pageSize={SKINCARE_PAGE_SIZE}
      basePath="/skincare"
    />
  );
}
