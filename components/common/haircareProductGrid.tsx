import CategoryProductGrid, { type ProductGridPage } from "./categoryProductGrid";

export default function HaircareProductGrid(page: ProductGridPage) {
  return <CategoryProductGrid {...page} basePath="/haircare" />;
}
