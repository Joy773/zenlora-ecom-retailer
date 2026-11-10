"use client";

import { MAKEUP_PAGE_SIZE, makeupProducts } from "./allProducts";
import CategoryProductGrid from "./categoryProductGrid";

export default function MakeupProductGrid() {
  return (
    <CategoryProductGrid
      products={makeupProducts}
      pageSize={MAKEUP_PAGE_SIZE}
      basePath="/makeup"
    />
  );
}
