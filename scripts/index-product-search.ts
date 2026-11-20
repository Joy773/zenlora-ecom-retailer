import mongoose from "mongoose";
import { connectMongoose } from "../lib/mongoose";
import { productSearchGrams, searchIndex } from "../lib/product-search";
import { Product } from "../models/Product";

async function indexSearch() {
  await connectMongoose();
  await Product.collection.createIndex(searchIndex);
  const cursor = Product.find().select("name brand description seoSlug category subcategory updatedAt +searchGrams").lean().cursor();
  let updated = 0;
  for await (const product of cursor) {
    const grams = productSearchGrams(product);
    if (JSON.stringify(product.searchGrams) === JSON.stringify(grams)) continue;
    const result = await Product.updateOne(
      { _id: product._id, updatedAt: product.updatedAt ?? { $exists: false } },
      { $set: { searchGrams: grams } },
      { timestamps: false },
    );
    if (!result.matchedCount) throw new Error("Catalog changed during indexing. Rerun the migration.");
    updated += result.modifiedCount;
  }
  console.log(`Updated search keys for ${updated} products.`);
}

indexSearch().catch((error) => {
  console.error("Search indexing failed:", error.name);
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
