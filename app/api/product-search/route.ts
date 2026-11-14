import { NextResponse } from "next/server";
import { getStoreProducts } from "@/lib/store-products";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (!query) return NextResponse.json({ products: [] });

  const products = await getStoreProducts({ search: query, limit: 6 });

  return NextResponse.json({
    products: products.map((product) => ({
      name: product.name,
      href: product.href,
      image: product.image,
      price: product.price,
    })),
  });
}
