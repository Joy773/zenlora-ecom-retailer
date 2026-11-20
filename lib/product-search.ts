import { mainCategories } from "./product-categories";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const searchIndex = { searchGrams: 1, createdAt: -1, _id: -1 } as const;

type SearchableProduct = {
  name: string;
  brand?: string;
  description?: string;
  seoSlug?: string;
  category: string;
  subcategory: string;
};

function fold(value: string) {
  // Fold each character independently so a substring has the same index key in context.
  return Array.from(value, (char) => char.toUpperCase().toLowerCase()).join("");
}

export function productSearchGrams(product: SearchableProduct) {
  const category = mainCategories.find((item) => item.value === product.category);
  const label = category?.groups.flatMap((group) => group.items)
    .find((item) => `${item.param}:${item.value}` === product.subcategory)?.label;
  const grams = new Set<string>();
  for (const field of [product.name, product.brand, product.description, product.seoSlug,
    product.category, product.subcategory, label]) {
    if (!field) continue;
    const chars = Array.from(fold(field));
    for (let i = 0; i < chars.length; i++) {
      let gram = "";
      for (const char of chars.slice(i, i + 3)) {
        gram += char;
        grams.add(gram);
      }
    }
  }
  return [...grams].sort();
}

export function productSearchFilter(search: string, admin = false) {
  const expression = new RegExp(escapeRegex(search), "i");
  const fields = ["name", "brand", "description"];
  if (admin) fields.push("seoSlug", "category", "subcategory");
  const matches: Record<string, unknown>[] = fields.map((field) => ({ [field]: expression }));
  if (admin) {
    for (const category of mainCategories) {
      for (const group of category.groups) {
        for (const item of group.items) {
          if (expression.test(item.label)) {
            matches.push({ category: category.value, subcategory: `${item.param}:${item.value}` });
          }
        }
      }
    }
  }
  // The equality narrows the index scan. Verify the full literal on those candidates.
  return { searchGrams: Array.from(fold(search)).slice(0, 3).join(""), $or: matches };
}
