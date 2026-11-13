import { Suspense } from "react";
import { CategoryListing } from "@/components/common/allProducts";
import CategoryProductGrid from "@/components/common/categoryProductGrid";
import Searchbar from "@/components/common/searchbar";
import { getStoreProducts } from "@/lib/store-products";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function OffersContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const products = await getStoreProducts({
    search: valueOf(params.q),
    isOffer: true,
  });

  return (
    <CategoryListing
      title="Offers"
      description="Shop current Zenlora offers and enjoy more from your routine."
      toolbar={<Searchbar placeholder="Search offers" basePath="/offers" />}
    >
      <CategoryProductGrid products={products} pageSize={9} basePath="/offers" />
    </CategoryListing>
  );
}

export default function OffersPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={null}>
      <OffersContent searchParams={searchParams} />
    </Suspense>
  );
}
