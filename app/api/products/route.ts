import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadProductImage } from "@/lib/cloudinary";
import { connectMongoose } from "@/lib/mongoose";
import { getDiscountPercent, Product } from "@/models/Product";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function flag(formData: FormData, key: string) {
  return text(formData, key) === "true";
}

function sizePrices(
  formData: FormData,
  uploadedImages: string[] = [],
) {
  const value = text(formData, "sizePrices");
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    const variants = parsed.filter(
      (item): item is {
        size: string;
        price: string;
        discountedPrice?: string;
        images?: string[];
      } =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as { size?: unknown }).size === "string" &&
        typeof (item as { price?: unknown }).price === "string" &&
        (item as { size: string }).size.trim() !== "" &&
        (item as { price: string }).price.trim() !== "",
    );
    const sizes = formData.getAll("sizeImageSizes").filter(
      (item): item is string => typeof item === "string",
    );
    return variants.map((variant) => ({
      ...variant,
      discountPercent: getDiscountPercent(variant.price, variant.discountedPrice ?? ""),
      images: [
        ...(Array.isArray(variant.images) ? variant.images : []),
        ...uploadedImages.filter((_, index) => sizes[index] === variant.size),
      ],
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to view products." },
      { status: 401 },
    );
  }

  await connectMongoose();

  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    products: products.map((product) => ({
      id: String(product._id),
      name: product.name,
      price: product.sizePrices?.[0]?.price ?? "",
      discountedPrice: product.sizePrices?.[0]?.discountedPrice ?? "",
      discount: product.sizePrices?.[0]?.discountPercent ?? null,
      quantity: product.quantity,
      description: product.description ?? "",
      keyBenefits: product.keyBenefits ?? "",
      keyIngredients: product.keyIngredients ?? "",
      howToUse: product.howToUse ?? "",
      perfectFor: product.perfectFor ?? "",
      seoMetaTitle: product.seoMetaTitle ?? "",
      seoMetaDescription: product.seoMetaDescription ?? "",
      seoSlug: product.seoSlug ?? "",
      images: (product.sizePrices ?? []).flatMap((variant) => variant.images ?? []),
      sizes: product.sizes ?? [],
      sizePrices: (product.sizePrices ?? []).map((variant) => ({
        ...variant,
        discountPercent: getDiscountPercent(
          variant.price ?? "",
          variant.discountedPrice ?? "",
        ),
      })),
      inStock: product.inStock ?? true,
      brand: product.brand ?? "",
      format: product.format ?? "",
      aboutBrand: product.aboutBrand ?? "",
      shipping: product.shipping ?? "",
      category: product.category,
      subcategory: product.subcategory,
      isNewArrival: Boolean(product.isNewArrival),
      isOffer: Boolean(product.isOffer),
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to save a product." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const name = text(formData, "name");
  const quantity = Number(text(formData, "quantity"));
  const category = text(formData, "category");
  const subcategory = text(formData, "subcategory");
  const submittedSizePrices = sizePrices(formData);
  const price = submittedSizePrices[0]?.price ?? "";

  if (!name || !price || !category || !subcategory || !Number.isFinite(quantity)) {
    return NextResponse.json(
      { error: "Name, price, quantity, category, and subcategory are required." },
      { status: 400 },
    );
  }

  if (quantity < 0) {
    return NextResponse.json(
      { error: "Quantity cannot be negative." },
      { status: 400 },
    );
  }

  let sizeImages: string[] = [];

  try {
    const variantFiles = formData
      .getAll("sizeImages")
      .filter((value): value is File => value instanceof File && value.size > 0);
    sizeImages = await Promise.all(
      variantFiles.map((file) => uploadProductImage(file)),
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Cloudinary is not configured"
        ? "Add Cloudinary keys in .env.local before saving product images."
        : "Could not upload the product images.";

    return NextResponse.json({ error: message }, { status: 500 });
  }

  await connectMongoose();

  const product = await Product.create({
    name,
    quantity,
    description: text(formData, "description"),
    keyBenefits: text(formData, "keyBenefits"),
    keyIngredients: text(formData, "keyIngredients"),
    howToUse: text(formData, "howToUse"),
    perfectFor: text(formData, "perfectFor"),
    seoMetaTitle: text(formData, "seoMetaTitle"),
    seoMetaDescription: text(formData, "seoMetaDescription"),
    seoSlug: text(formData, "seoSlug"),
    sizes: formData
      .getAll("sizes")
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean),
    sizePrices: sizePrices(formData, sizeImages),
    inStock: flag(formData, "inStock"),
    brand: text(formData, "brand"),
    format: text(formData, "format"),
    aboutBrand: text(formData, "aboutBrand"),
    shipping: text(formData, "shipping"),
    category,
    subcategory,
    isNewArrival: flag(formData, "isNewArrival"),
    isOffer: flag(formData, "isOffer"),
  });

  return NextResponse.json({ id: product._id.toString() });
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to update a product." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const quantity = Number(text(formData, "quantity"));
  const category = text(formData, "category");
  const subcategory = text(formData, "subcategory");
  const submittedSizePrices = sizePrices(formData);
  const price = submittedSizePrices[0]?.price ?? "";

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { error: "A valid product id is required." },
      { status: 400 },
    );
  }

  if (!name || !price || !category || !subcategory || !Number.isFinite(quantity)) {
    return NextResponse.json(
      { error: "Name, price, quantity, category, and subcategory are required." },
      { status: 400 },
    );
  }

  if (quantity < 0) {
    return NextResponse.json(
      { error: "Quantity cannot be negative." },
      { status: 400 },
    );
  }

  let uploadedSizeImages: string[] = [];

  try {
    const variantFiles = formData
      .getAll("sizeImages")
      .filter((value): value is File => value instanceof File && value.size > 0);
    uploadedSizeImages = await Promise.all(
      variantFiles.map((file) => uploadProductImage(file)),
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Cloudinary is not configured"
        ? "Add Cloudinary keys in .env.local before saving product images."
        : "Could not upload the product images.";

    return NextResponse.json({ error: message }, { status: 500 });
  }

  await connectMongoose();

  const product = await Product.findById(id);

  if (!product) {
    return NextResponse.json({ error: "Product was not found." }, { status: 404 });
  }

  product.name = name;
  product.quantity = quantity;
  product.description = text(formData, "description");
  product.keyBenefits = text(formData, "keyBenefits");
  product.keyIngredients = text(formData, "keyIngredients");
  product.howToUse = text(formData, "howToUse");
  product.perfectFor = text(formData, "perfectFor");
  product.seoMetaTitle = text(formData, "seoMetaTitle");
  product.seoMetaDescription = text(formData, "seoMetaDescription");
  product.seoSlug = text(formData, "seoSlug");
  product.sizes = formData
    .getAll("sizes")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
  product.set("sizePrices", sizePrices(formData, uploadedSizeImages));
  product.inStock = flag(formData, "inStock");
  product.brand = text(formData, "brand");
  product.format = text(formData, "format");
  product.aboutBrand = text(formData, "aboutBrand");
  product.shipping = text(formData, "shipping");
  product.category = category;
  product.subcategory = subcategory;
  product.isNewArrival = flag(formData, "isNewArrival");
  product.isOffer = flag(formData, "isOffer");

  await product.save();
  await Product.updateOne(
    { _id: product._id },
    {
      $unset: {
        price: 1,
        discountedPrice: 1,
        discount: 1,
        additionalInformation: 1,
      },
    },
  );

  return NextResponse.json({ id: product._id.toString() });
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to delete a product." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const id = typeof body?.id === "string" ? body.id.trim() : "";

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { error: "A valid product id is required." },
      { status: 400 },
    );
  }

  await connectMongoose();

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return NextResponse.json({ error: "Product was not found." }, { status: 404 });
  }

  return NextResponse.json({ id });
}
