import { Suspense } from "react";
import {
  HaircareProducts,
} from "@/components/common/allProducts";
import Category, {
  haircareCategoryGroups,
} from "@/components/common/category";
import HaircareProductGrid from "@/components/common/haircareProductGrid";
import Searchbar from "@/components/common/searchbar";

export default function HaircarePage() {
  return (
    <Suspense fallback={null}>
      <HaircareProducts
        toolbar={
          <Searchbar placeholder="Search haircare" basePath="/haircare" />
        }
        sidebar={
          <Category
            groups={haircareCategoryGroups}
            basePath="/haircare"
            defaultOpen="Hair Care"
          />
        }
      >
        <HaircareProductGrid />
      </HaircareProducts>
    </Suspense>
  );
}
