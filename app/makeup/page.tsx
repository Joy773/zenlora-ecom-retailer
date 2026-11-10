import { Suspense } from "react";
import { MakeupProducts } from "@/components/common/allProducts";
import Category, { makeupCategoryGroups } from "@/components/common/category";
import MakeupProductGrid from "@/components/common/makeupProductGrid";
import Searchbar from "@/components/common/searchbar";

export default function MakeupPage() {
  return (
    <Suspense fallback={null}>
      <MakeupProducts
        toolbar={
          <Searchbar placeholder="Search makeup" basePath="/makeup" />
        }
        sidebar={
          <Category
            groups={makeupCategoryGroups}
            basePath="/makeup"
            defaultOpen="Face"
          />
        }
      >
        <MakeupProductGrid />
      </MakeupProducts>
    </Suspense>
  );
}
