"use client";

import {
  SKINCARE_PAGE_SIZE,
  skincareProducts,
} from "./allProducts";
import CategoryProductGrid from "./categoryProductGrid";

export default function SkincareProductGrid() {
  return (
    <CategoryProductGrid
      products={skincareProducts}
      pageSize={SKINCARE_PAGE_SIZE}
      basePath="/skincare"
    />
  );
}
