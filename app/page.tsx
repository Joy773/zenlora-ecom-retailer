import { Suspense } from "react";
import Categories from "@/components/categories";
import AllProducts from "@/components/common/allProducts";
import ProductGridSkeleton from "@/components/common/productGridSkeleton";
import Hero from "@/components/common/hero";
import NowTrending from "@/components/NowTrending";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Suspense
        fallback={
          <div className="px-8 py-12 md:px-16 lg:px-20">
            <ProductGridSkeleton />
          </div>
        }
      >
        <AllProducts />
      </Suspense>
      <NowTrending />
    </>
  );
}
