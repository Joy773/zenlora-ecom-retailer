import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

function parseMoney(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;

  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : null;
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
    price: { type: String, required: true, trim: true },
    discountedPrice: { type: String, default: "", trim: true },
    discount: { type: Number, default: null },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", trim: true },
    additionalInformation: { type: String, default: "", trim: true },
    seoMetaTitle: { type: String, default: "", trim: true, maxlength: 60 },
    seoMetaDescription: { type: String, default: "", trim: true, maxlength: 160 },
    seoSlug: { type: String, default: "", trim: true, lowercase: true },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    sizePrices: {
      type: [{ size: String, price: String, discountedPrice: String, images: { type: [String], default: [] } }],
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
  },
  { timestamps: true },
);

productSchema.pre("validate", function () {
  this.discount = getDiscountPercent(this.price, this.discountedPrice ?? "");
});

export type ProductDocument = InferSchemaType<typeof productSchema>;

if (process.env.NODE_ENV !== "production" && mongoose.models.Product) {
  mongoose.deleteModel("Product");
}

export const Product: Model<ProductDocument> =
  mongoose.models.Product || mongoose.model("Product", productSchema);
