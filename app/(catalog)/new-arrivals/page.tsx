import { CategoryListing } from "@/components/common/allProducts";
import CategoryProductGrid from "@/components/common/categoryProductGrid";
import Searchbar from "@/components/common/searchbar";
import { getStoreProductPage } from "@/lib/store-products";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewArrivalsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = await getStoreProductPage({
    search: valueOf(params.q),
    isNewArrival: true,
  }, valueOf(params.page));

  return (
    <CategoryListing
      title="New Arrivals"
      description="Discover the latest products added to the Zenlora collection."
      toolbar={<Searchbar placeholder="Search new arrivals" basePath="/new-arrivals" />}
    >
      <CategoryProductGrid
        {...page}
        basePath="/new-arrivals"
      />
    </CategoryListing>
  );
}
