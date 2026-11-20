import CategoryProductGrid, { type ProductGridPage } from "./categoryProductGrid";

export default function SkincareProductGrid(page: ProductGridPage) {
  return <CategoryProductGrid {...page} basePath="/skincare" />;
}
