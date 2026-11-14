import mongoose from "mongoose";
import { connectMongoose } from "@/lib/mongoose";
import { getDiscountPercent, Product } from "@/models/Product";

export type StoreProductVariant = {
  size: string;
  price: string;
  discountedPrice: string;
  discountPercent: number | null;
  images: string[];
};

export type StoreProduct = {
  id: string;
  slug: string;
  href: string;
  name: string;
  price: string;
  compareAtPrice?: string;
  discount: number | null;
  image: string;
  images: { src: string; alt: string }[];
  alt: string;
  description: string;
  keyBenefits: string;
  keyIngredients: string;
  howToUse: string;
  perfectFor: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  sizes: string[];
  sizePrices: StoreProductVariant[];
  inStock: boolean;
  quantity: number;
  brand: string;
  format: string;
  aboutBrand: string;
  shipping: string;
  category: string;
  subcategory: string;
  isNewArrival: boolean;
  isOffer: boolean;
  isBestSelling: boolean;
};

type StoreProductOptions = {
  category?: string;
  subcategory?: string;
  type?: string;
  concern?: string;
  search?: string;
  isNewArrival?: boolean;
  isOffer?: boolean;
  isBestSelling?: boolean;
  price?: string[];
  limit?: number;
  excludeId?: string;
};

type ProductRecord = {
  _id: { toString: () => string };
  name: string;
  quantity: number;
  description?: string;
  keyBenefits?: string;
  keyIngredients?: string;
  howToUse?: string;
  perfectFor?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoSlug?: string;
  sizes?: string[];
  sizePrices?: {
    size?: string;
    price?: string;
    discountedPrice?: string;
    discountPercent?: number | null;
    images?: string[];
  }[];
  inStock?: boolean;
  brand?: string;
  format?: string;
  aboutBrand?: string;
  shipping?: string;
  category: string;
  subcategory: string;
  isNewArrival?: boolean;
  isOffer?: boolean;
  isBestSelling?: boolean;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function firstValue(value: string | undefined) {
  return value?.trim() ?? "";
}

function numericPrice(value: string) {
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function matchesPriceFilter(price: number, filter: string) {
  switch (filter) {
    case "under-500":
      return price < 500;
    case "500-1000":
      return price >= 500 && price < 1000;
    case "1000-1500":
      return price >= 1000 && price < 1500;
    case "1500-2000":
      return price >= 1500 && price < 2000;
    case "over-2000":
      return price >= 2000;
    default:
      return false;
  }
}

function mapProduct(product: ProductRecord): StoreProduct {
  const variants: StoreProductVariant[] = (product.sizePrices ?? []).map(
    (variant) => ({
      size: firstValue(variant.size),
      price: firstValue(variant.price),
      discountedPrice: firstValue(variant.discountedPrice),
      discountPercent: getDiscountPercent(
        firstValue(variant.price),
        firstValue(variant.discountedPrice),
      ),
      images: Array.isArray(variant.images) ? variant.images.filter(Boolean) : [],
    }),
  );
  const firstVariant = variants[0];
  const images = variants.flatMap((variant) => variant.images);
  const id = product._id.toString();
  const slug = firstValue(product.seoSlug) || id;
  const salePrice = firstVariant?.discountedPrice ?? "";

  return {
    id,
    slug,
    href: `/product/${encodeURIComponent(slug)}`,
    name: product.name,
    price: salePrice || firstVariant?.price || "",
    compareAtPrice: salePrice ? firstVariant?.price : undefined,
    discount: firstVariant?.discountPercent ?? null,
    image: images[0] ?? "",
    images: images.map((src) => ({ src, alt: product.name })),
    alt: product.name,
    description: firstValue(product.description),
    keyBenefits: firstValue(product.keyBenefits),
    keyIngredients: firstValue(product.keyIngredients),
    howToUse: firstValue(product.howToUse),
    perfectFor: firstValue(product.perfectFor),
    seoMetaTitle: firstValue(product.seoMetaTitle),
    seoMetaDescription: firstValue(product.seoMetaDescription),
    sizes: Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : [],
    sizePrices: variants,
    inStock: product.inStock ?? true,
    quantity: product.quantity,
    brand: firstValue(product.brand),
    format: firstValue(product.format),
    aboutBrand: firstValue(product.aboutBrand),
    shipping: firstValue(product.shipping),
    category: product.category,
    subcategory: product.subcategory,
    isNewArrival: Boolean(product.isNewArrival),
    isOffer: Boolean(product.isOffer),
    isBestSelling: Boolean(product.isBestSelling),
  };
}

export async function getStoreProducts(
  options: StoreProductOptions = {},
): Promise<StoreProduct[]> {
  await connectMongoose();

  const filter: Record<string, unknown> = {};

  if (options.category) filter.category = options.category;
  if (options.subcategory) {
    filter.subcategory = options.subcategory;
  } else if (options.type) {
    filter.subcategory = `type:${options.type}`;
  } else if (options.concern) {
    filter.subcategory = `concern:${options.concern}`;
  }
  if (options.excludeId && mongoose.isValidObjectId(options.excludeId)) {
    filter._id = { $ne: new mongoose.Types.ObjectId(options.excludeId) };
  }
  if (options.isNewArrival !== undefined) {
    filter.isNewArrival = options.isNewArrival;
  }
  if (options.isOffer !== undefined) filter.isOffer = options.isOffer;
  if (options.isBestSelling !== undefined) {
    filter.isBestSelling = options.isBestSelling;
  }

  const search = options.search?.trim();
  if (search) {
    const expression = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { name: expression },
      { brand: expression },
      { description: expression },
    ];
  }

  const query = Product.find(filter).sort({ createdAt: -1 });
  if (options.limit) query.limit(options.limit);

  const products = (await query.lean()) as unknown as ProductRecord[];
  const mappedProducts = products.map(mapProduct);

  const priceFilters = options.price;
  if (!priceFilters?.length) return mappedProducts;

  return mappedProducts.filter((product) => {
    const price = numericPrice(product.price);
    return (
      price !== null &&
      priceFilters.some((filter) => matchesPriceFilter(price, filter))
    );
  });
}

export async function getStoreProductBySlug(
  slug: string,
): Promise<StoreProduct | null> {
  await connectMongoose();

  const normalizedSlug = decodeURIComponent(slug).trim();
  const product = mongoose.isValidObjectId(normalizedSlug)
    ? await Product.findOne({
        $or: [{ seoSlug: normalizedSlug }, { _id: normalizedSlug }],
      }).lean()
    : await Product.findOne({ seoSlug: normalizedSlug }).lean();

  return product ? mapProduct(product as unknown as ProductRecord) : null;
}
