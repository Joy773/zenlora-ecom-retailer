import { Suspense } from "react";
import { MakeupProducts } from "@/components/common/allProducts";
import Category, { makeupCategoryGroups } from "@/components/common/category";
import MakeupProductGrid from "@/components/common/makeupProductGrid";
import Searchbar from "@/components/common/searchbar";
import { getStoreProductPage } from "@/lib/store-products";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function MakeupPageContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const flag = valueOf(params.flag);
  const page = await getStoreProductPage({
    category: "makeup",
    type: valueOf(params.type),
    concern: valueOf(params.concern),
    search: valueOf(params.q),
    price: valueOf(params.price)?.split(",").filter(Boolean),
    isNewArrival: flag === "new" ? true : undefined,
    isOffer: flag === "offer" ? true : undefined,
    isBestSelling: flag === "best-selling" ? true : undefined,
  }, valueOf(params.page));

  return (
    <MakeupProducts
      toolbar={<Searchbar placeholder="Search makeup" basePath="/makeup" />}
      sidebar={
        <Category
          groups={makeupCategoryGroups}
          basePath="/makeup"
          defaultOpen="Face"
        />
      }
    >
      <MakeupProductGrid {...page} />
    </MakeupProducts>
  );
}

export default function MakeupPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={null}>
      <MakeupPageContent searchParams={searchParams} />
    </Suspense>
  );
}
