import { Suspense } from "react";
import { SkincareProducts } from "@/components/common/allProducts";
import Category, {
  skincareCategoryGroups,
} from "@/components/common/category";
import Searchbar from "@/components/common/searchbar";
import SkincareProductGrid from "@/components/common/skincareProductGrid";

export default function SkincarePage() {
  return (
    <Suspense fallback={null}>
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
        <SkincareProductGrid />
      </SkincareProducts>
    </Suspense>
  );
}
