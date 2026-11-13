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

async function NewArrivalsContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const products = await getStoreProducts({
    search: valueOf(params.q),
    isNewArrival: true,
  });

  return (
    <CategoryListing
      title="New Arrivals"
      description="Discover the latest products added to the Zenlora collection."
      toolbar={<Searchbar placeholder="Search new arrivals" basePath="/new-arrivals" />}
    >
      <CategoryProductGrid
        products={products}
        pageSize={9}
        basePath="/new-arrivals"
      />
    </CategoryListing>
  );
}

export default function NewArrivalsPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={null}>
      <NewArrivalsContent searchParams={searchParams} />
    </Suspense>
  );
}
