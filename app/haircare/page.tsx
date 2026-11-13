import { Suspense } from "react";
import {
  HaircareProducts,
} from "@/components/common/allProducts";
import Category, {
  haircareCategoryGroups,
} from "@/components/common/category";
import HaircareProductGrid from "@/components/common/haircareProductGrid";
import Searchbar from "@/components/common/searchbar";
import { getStoreProducts } from "@/lib/store-products";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function HaircarePageContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const flag = valueOf(params.flag);
  const products = await getStoreProducts({
    category: "haircare",
    type: valueOf(params.type),
    concern: valueOf(params.concern),
    search: valueOf(params.q),
    isNewArrival: flag === "new" ? true : undefined,
    isOffer: flag === "offer" ? true : undefined,
  });

  return (
    <HaircareProducts
      toolbar={<Searchbar placeholder="Search haircare" basePath="/haircare" />}
      sidebar={
        <Category
          groups={haircareCategoryGroups}
          basePath="/haircare"
          defaultOpen="Hair Care"
        />
      }
    >
      <HaircareProductGrid products={products} />
    </HaircareProducts>
  );
}

export default function HaircarePage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={null}>
      <HaircarePageContent searchParams={searchParams} />
    </Suspense>
  );
}
