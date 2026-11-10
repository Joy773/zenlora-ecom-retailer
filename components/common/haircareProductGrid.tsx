"use client";

import {
  HAIRCARE_PAGE_SIZE,
  haircareProducts,
} from "./allProducts";
import CategoryProductGrid from "./categoryProductGrid";

export default function HaircareProductGrid() {
  return (
    <CategoryProductGrid
      products={haircareProducts}
      pageSize={HAIRCARE_PAGE_SIZE}
      basePath="/haircare"
    />
  );
}
