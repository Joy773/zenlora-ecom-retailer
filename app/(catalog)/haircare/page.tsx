import {
  HaircareProducts,
} from "@/components/common/allProducts";
import Category, {
  haircareCategoryGroups,
} from "@/components/common/category";
import HaircareProductGrid from "@/components/common/haircareProductGrid";
import Searchbar from "@/components/common/searchbar";
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

export default async function HaircarePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const flag = valueOf(params.flag);
  const [page, counts] = await Promise.all([
    getStoreProductPage(
      {
        category: "haircare",
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
    getStoreSubcategoryCounts("haircare"),
  ]);

  return (
    <HaircareProducts
      toolbar={<Searchbar placeholder="Search haircare" basePath="/haircare" />}
      sidebar={
        <Category
          groups={haircareCategoryGroups}
          counts={counts}
          basePath="/haircare"
          defaultOpen="Hair Care"
        />
      }
    >
      <HaircareProductGrid {...page} />
    </HaircareProducts>
  );
}
