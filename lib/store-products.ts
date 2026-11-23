import { cacheLife, cacheTag } from "next/cache";
import { catalogListingsTag, productTag } from "@/lib/catalog-cache";
import { productSearchFilter, searchIndex } from "@/lib/product-search";
import { pageWindow } from "@/lib/pagination";
import mongoose from "mongoose";
import { connectMongoose } from "@/lib/mongoose";
import { getDiscountPercent, Product } from "@/models/Product";

export type StoreProductVariant = {
  inStock: boolean;
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
    inStock?: boolean;
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

function firstValue(value: string | undefined) {
  return value?.trim() ?? "";
}

const priceBands: Record<string, Record<string, number>> = {
  "under-500": { $lt: 500 },
  "500-1000": { $gte: 500, $lt: 1000 },
  "1000-1500": { $gte: 1000, $lt: 1500 },
  "1500-2000": { $gte: 1500, $lt: 2000 },
  "2000-3000": { $gte: 2000, $lte: 3000 },
  "over-3000": { $gt: 3000 },
};

function mapProduct(product: ProductRecord): StoreProduct {
  const variants: StoreProductVariant[] = (product.sizePrices ?? []).map(
    (variant) => ({
      size: firstValue(variant.size),
      inStock: variant.inStock ?? product.inStock ?? true,
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
    inStock: variants.length ? variants.some((variant) => variant.inStock) : product.inStock ?? true,
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

function productFilter(options: StoreProductOptions) {
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
  if (search) Object.assign(filter, productSearchFilter(search));

  if (options.price?.length) {
    const bands = options.price.filter((band) => Object.hasOwn(priceBands, band));
    const ranges = bands.map((band) => priceBands[band]);
    if (ranges.length) {
      const variantPrice = {
        $let: {
          vars: {
            firstVariant: { $arrayElemAt: ["$sizePrices", 0] },
          },
          in: {
            $let: {
              vars: {
                salePrice: {
                  $trim: {
                    input: { $ifNull: ["$$firstVariant.discountedPrice", ""] },
                  },
                },
              },
              in: {
                $cond: [
                  { $ne: ["$$salePrice", ""] },
                  "$$salePrice",
                  { $ifNull: ["$$firstVariant.price", ""] },
                ],
              },
            },
          },
        },
      };
      const parsedVariantPrice = {
        $let: {
          vars: {
            match: {
              $regexFind: {
                input: {
                  $replaceAll: {
                    input: variantPrice,
                    find: ",",
                    replacement: "",
                  },
                },
                regex: "[0-9]+(?:\\.[0-9]+)?",
              },
            },
          },
          in: {
            $convert: {
              input: "$$match.match",
              to: "double",
              onError: null,
              onNull: null,
            },
          },
        },
      };
      const fallbackRanges = ranges.map((range) => ({
        $and: Object.entries(range).map(([operator, amount]) => ({
          [operator]: [parsedVariantPrice, amount],
        })),
      }));

      filter.$and = [
        ...((filter.$and as Record<string, unknown>[] | undefined) ?? []),
        {
          $or: [
            ...ranges.map((range) => ({ listingPrice: range })),
            {
              listingPrice: null,
              $expr: { $or: fallbackRanges },
            },
          ],
        },
      ];
    }
    else filter._id = { $in: [] };
  }
  return filter;
}

type CardRecord = Pick<ProductRecord, "_id" | "name" | "seoSlug" | "isNewArrival" | "isOffer"> & {
  variant?: { price?: string; discountedPrice?: string };
  image?: string;
};

function cardQuery(filter: Record<string, unknown>) {
  const query = Product.find(filter, {
    name: 1, seoSlug: 1, isNewArrival: 1, isOffer: 1,
    variant: {
      $let: {
        vars: { first: { $arrayElemAt: ["$sizePrices", 0] } },
        in: { price: "$$first.price", discountedPrice: "$$first.discountedPrice" },
      },
    },
    image: {
      $reduce: {
        input: "$sizePrices",
        initialValue: "",
        in: {
          $cond: [
            { $ne: ["$$value", ""] }, "$$value",
            { $ifNull: [{ $arrayElemAt: [{
              $filter: { input: "$$this.images", as: "src", cond: { $gt: ["$$src", ""] } },
            }, 0] }, ""] },
          ],
        },
      },
    },
  }).sort({ createdAt: -1, _id: -1 }).lean<CardRecord[]>();
  return filter.searchGrams ? query.hint(searchIndex) : query;
}

function mapCard(product: CardRecord) {
  const id = product._id.toString();
  const slug = firstValue(product.seoSlug) || id;
  const price = firstValue(product.variant?.price);
  const sale = firstValue(product.variant?.discountedPrice);
  return {
    id, slug, name: product.name, alt: product.name,
    href: `/product/${encodeURIComponent(slug)}`,
    price: sale || price,
    compareAtPrice: sale ? price : undefined,
    discount: getDiscountPercent(price, sale),
    image: product.image ?? "",
    isNewArrival: Boolean(product.isNewArrival),
    isOffer: Boolean(product.isOffer),
  };
}

export type StoreProductCard = ReturnType<typeof mapCard>;

type LimitedProductOptions = StoreProductOptions & { limit: number };

async function readStoreProducts(options: LimitedProductOptions) {
  await connectMongoose();
  return (await cardQuery(productFilter(options)).limit(options.limit)).map(mapCard);
}

async function cachedStoreProducts(options: LimitedProductOptions) {
  "use cache: remote";
  cacheLife("minutes");
  cacheTag(catalogListingsTag);
  return readStoreProducts(options);
}

export function getStoreProducts(options: LimitedProductOptions) {
  return options.search?.trim() ? readStoreProducts(options) : cachedStoreProducts(options);
}

async function readStoreSubcategoryCounts(category: string) {
  await connectMongoose();

  const counts = await Product.aggregate<{ _id: string; count: number }>([
    { $match: { category } },
    { $group: { _id: "$subcategory", count: { $sum: 1 } } },
  ]);

  return Object.fromEntries(counts.map(({ _id, count }) => [_id, count]));
}

async function cachedStoreSubcategoryCounts(category: string) {
  "use cache: remote";
  cacheLife("minutes");
  cacheTag(catalogListingsTag);
  return readStoreSubcategoryCounts(category);
}

export function getStoreSubcategoryCounts(category: string) {
  return cachedStoreSubcategoryCounts(category);
}

async function readStoreProductPage(options: StoreProductOptions, page?: string) {
  await connectMongoose();
  const filter = productFilter(options);
  const size = 9;
  const count = Product.countDocuments(filter);
  if (filter.searchGrams) count.hint(searchIndex);
  const { currentPage, totalPages, offset } = pageWindow(await count, size, page);
  const products = await cardQuery(filter).skip(offset).limit(size);
  return { products: products.map(mapCard), currentPage, totalPages };
}

async function cachedStoreProductPage(options: StoreProductOptions, page: string) {
  "use cache: remote";
  cacheLife("minutes");
  cacheTag(catalogListingsTag);
  return readStoreProductPage(options, page);
}

export function getStoreProductPage(options: StoreProductOptions, page?: string) {
  if (options.search?.trim()) return readStoreProductPage(options, page);
  const requested = Number(page);
  const normalizedPage = Number.isSafeInteger(requested) && requested > 0 ? requested : 1;
  return cachedStoreProductPage({
    ...options,
    search: undefined,
    price: options.price?.length ? [...new Set(options.price)].sort() : undefined,
  }, String(normalizedPage));
}

export async function getStoreProductBySlug(
  slug: string,
): Promise<StoreProduct | null> {
  "use cache: remote";
  cacheLife("minutes");
  await connectMongoose();

  const normalizedSlug = decodeURIComponent(slug).trim();
  const product = mongoose.isValidObjectId(normalizedSlug)
    ? await Product.findOne({
        $or: [{ seoSlug: normalizedSlug }, { _id: normalizedSlug }],
      }).lean()
    : await Product.findOne({ seoSlug: normalizedSlug }).lean();

  // A later create or rename can turn a cached miss into a valid product.
  cacheTag(product ? productTag(String(product._id)) : catalogListingsTag);
  return product ? mapProduct(product as unknown as ProductRecord) : null;
}
