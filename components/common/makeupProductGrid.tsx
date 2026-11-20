import CategoryProductGrid, { type ProductGridPage } from "./categoryProductGrid";

export default function MakeupProductGrid(page: ProductGridPage) {
  return <CategoryProductGrid {...page} basePath="/makeup" />;
}
