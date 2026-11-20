import { productSearchGrams, searchIndex } from "../lib/product-search";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

function parseMoney(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;

  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : null;
}

export function listingPrice(variant?: { price?: string | null; discountedPrice?: string | null }) {
  return parseMoney(variant?.discountedPrice?.trim() || variant?.price || "");
}

export function getDiscountPercent(price: string, discountedPrice: string) {
  const original = parseMoney(price);
  const sale = parseMoney(discountedPrice);

  if (original === null || sale === null || original <= 0 || sale >= original) {
    return null;
  }

  return Math.round(((original - sale) / original) * 100);
}

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", trim: true },
    keyBenefits: { type: String, default: "", trim: true },
    keyIngredients: { type: String, default: "", trim: true },
    howToUse: { type: String, default: "", trim: true },
    perfectFor: { type: String, default: "", trim: true },
    seoMetaTitle: { type: String, default: "", trim: true, maxlength: 60 },
    seoMetaDescription: { type: String, default: "", trim: true, maxlength: 160 },
    seoSlug: { type: String, default: "", trim: true, lowercase: true },
    searchGrams: { type: [String], select: false },
    listingPrice: { type: Number, default: null },
    sizes: { type: [String], default: [] },
    sizePrices: {
      type: [
        {
          size: String,
          price: String,
          discountedPrice: String,
          inStock: { type: Boolean, default: undefined },
          discountPercent: { type: Number, default: null },
          images: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    inStock: { type: Boolean, default: true },
    brand: { type: String, default: "", trim: true },
    format: { type: String, default: "", trim: true },
    aboutBrand: { type: String, default: "", trim: true },
    shipping: { type: String, default: "", trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true, trim: true },
    isNewArrival: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false },
    isBestSelling: { type: Boolean, default: false },
  },
  { timestamps: true },
);

productSchema.index(searchIndex);
productSchema.index({ seoSlug: 1 });
productSchema.index({ createdAt: -1, _id: -1 });
productSchema.index({ category: 1, createdAt: -1, _id: -1 });

productSchema.pre("validate", function () {
  this.searchGrams = productSearchGrams(this);
  this.listingPrice = listingPrice(this.sizePrices[0]);
  this.sizePrices.forEach((variant) => {
    variant.discountPercent = getDiscountPercent(
      variant.price ?? "",
      variant.discountedPrice ?? "",
    );
  });
});

export type ProductDocument = InferSchemaType<typeof productSchema>;

if (process.env.NODE_ENV !== "production" && mongoose.models.Product) {
  mongoose.deleteModel("Product");
}

export const Product: Model<ProductDocument> =
  mongoose.models.Product || mongoose.model("Product", productSchema);
