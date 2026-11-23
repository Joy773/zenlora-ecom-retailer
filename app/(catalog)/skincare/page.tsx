import { SkincareProducts } from "@/components/common/allProducts";
import Category, {
  skincareCategoryGroups,
} from "@/components/common/category";
import Searchbar from "@/components/common/searchbar";
import SkincareProductGrid from "@/components/common/skincareProductGrid";
import {
  getStoreProductPage,
  getStoreSubcategoryCounts,
} from "@/lib/store-products";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SkincarePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const flag = valueOf(params.flag);
  const [page, counts] = await Promise.all([
    getStoreProductPage(
      {
        category: "skincare",
        type: valueOf(params.type),
        concern: valueOf(params.concern),
        search: valueOf(params.q),
        price: valueOf(params.price)?.split(",").filter(Boolean),
        isNewArrival: flag === "new" ? true : undefined,
        isOffer: flag === "offer" ? true : undefined,
        isBestSelling: flag === "best-selling" ? true : undefined,
      },
      valueOf(params.page),
    ),
    getStoreSubcategoryCounts("skincare"),
  ]);

  return (
    <SkincareProducts
      toolbar={<Searchbar placeholder="Search skincare" />}
      sidebar={
        <Category
          groups={skincareCategoryGroups}
          counts={counts}
          basePath="/skincare"
          defaultOpen="Face"
        />
      }
    >
      <SkincareProductGrid {...page} />
    </SkincareProducts>
  );
}
