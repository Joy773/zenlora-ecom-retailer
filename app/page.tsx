import Categories from "@/components/categories";
import AllProducts from "@/components/common/allProducts";
import Hero from "@/components/common/hero";
import NowTrending from "@/components/NowTrending";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <AllProducts />
      <NowTrending />
    </>
  );
}
