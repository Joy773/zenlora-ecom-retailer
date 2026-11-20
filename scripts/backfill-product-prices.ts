import mongoose from "mongoose";
import { connectMongoose } from "../lib/mongoose";
import { listingPrice, Product } from "../models/Product";

async function migrate() {
  await connectMongoose();
  await Product.createIndexes();
  const missing = { listingPrice: { $exists: false } };
  const cursor = Product.find(missing).select("sizePrices.price sizePrices.discountedPrice").lean().cursor();
  let updated = 0;
  for await (const product of cursor) {
    const result = await Product.updateOne(
      { _id: product._id, ...missing },
      { $set: { listingPrice: listingPrice(product.sizePrices?.[0]) } },
      { timestamps: false },
    );
    updated += result.modifiedCount;
  }
  console.log(`Backfilled listing prices for ${updated} products.`);
}

migrate().catch(() => {
  console.error("Product migration failed. Check database access and rerun.");
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
