import { Suspense } from "react";
import { SkincareProducts } from "@/components/common/allProducts";
import Category, {
  skincareCategoryGroups,
} from "@/components/common/category";
import Searchbar from "@/components/common/searchbar";
import SkincareProductGrid from "@/components/common/skincareProductGrid";
import { getStoreProducts } from "@/lib/store-products";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function SkincarePageContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const flag = valueOf(params.flag);
  const products = await getStoreProducts({
    category: "skincare",
    type: valueOf(params.type),
    concern: valueOf(params.concern),
    search: valueOf(params.q),
    price: valueOf(params.price)?.split(",").filter(Boolean),
    isNewArrival: flag === "new" ? true : undefined,
    isOffer: flag === "offer" ? true : undefined,
    isBestSelling: flag === "best-selling" ? true : undefined,
  });

  return (
    <SkincareProducts
      toolbar={<Searchbar placeholder="Search skincare" />}
      sidebar={
        <Category
          groups={skincareCategoryGroups}
          basePath="/skincare"
          defaultOpen="Face"
        />
      }
    >
      <SkincareProductGrid products={products} />
    </SkincareProducts>
  );
}

export default function SkincarePage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={null}>
      <SkincarePageContent searchParams={searchParams} />
    </Suspense>
  );
}
