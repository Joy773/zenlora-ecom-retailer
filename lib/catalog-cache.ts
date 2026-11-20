import { revalidateTag } from "next/cache";

export const catalogListingsTag = "catalog:listings";

export function productTag(id: string) {
  return `catalog:product:${id}`;
}

export function invalidateCatalogProduct(id: string) {
  revalidateTag(catalogListingsTag, { expire: 0 });
  revalidateTag(productTag(id), { expire: 0 });
}
