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

export default async function OffersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = await getStoreProductPage({
    search: valueOf(params.q),
    isOffer: true,
  }, valueOf(params.page));

  return (
    <CategoryListing
      title="Offers"
      description="Shop current Zenlora offers and enjoy more from your routine."
      toolbar={<Searchbar placeholder="Search offers" basePath="/offers" />}
    >
      <CategoryProductGrid {...page} basePath="/offers" />
    </CategoryListing>
  );
}
