"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { CartProduct } from "@/context/cart-context";
import type { StoreProduct } from "@/lib/store-products";
import { ProductCardAddToCartIcon } from "./productCartActions";
import Pagination from "./pagination";

function toCartProduct(product: StoreProduct): CartProduct {
  return {
    slug: product.slug ?? product.href.replace(/^\/product\//, ""),
    name: product.name,
    price: product.price,
    image: product.image,
    alt: product.alt,
    href: product.href,
  };
}

export default function CategoryProductGrid({
  products,
  pageSize,
  basePath,
}: {
  products: StoreProduct[];
  pageSize: number;
  basePath: string;
}) {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const requestedPage = Number(searchParams.get("page") ?? "1");

  const filteredProducts = useMemo(() => {
    if (!query) return products;
    return products.filter((product) => {
      const name = product.name.toLowerCase();
      const alt = product.alt.toLowerCase();
      return name.includes(query) || alt.includes(query);
    });
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(
    Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1),
    totalPages,
  );
  const startIndex = (currentPage - 1) * pageSize;
  const pageProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize,
  );

  const hrefForPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const next = params.toString();
    return next ? `${basePath}?${next}` : basePath;
  };

  return (
    <div className="min-w-0">
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 md:gap-8">
        {pageProducts.map((product) => (
          <li key={product.href} className="h-full">
            <div className="flex h-full flex-col">
              <div className="relative">
                <Link href={product.href} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-[#f2f2f0]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 45vw, 33vw"
                      />
                    ) : null}
                    {product.discount !== null && product.discount > 0 ? (
                      <span className="absolute top-2 left-2 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-accent text-center font-bold text-white">
                        <span className="text-[13px] leading-tight">{product.discount}%</span>
                        <span className="text-[10px] leading-tight tracking-wide">OFF</span>
                      </span>
                    ) : product.isNewArrival ? (
                      <span className="absolute top-2 left-2 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold tracking-wide text-foreground uppercase">
                        New Arrival
                      </span>
                    ) : null}
                  </div>
                </Link>
                <ProductCardAddToCartIcon product={toCartProduct(product)} />
              </div>
              <div className="mt-3 min-h-0">
                <Link href={product.href} className="min-w-0">
                  <p className="line-clamp-2 text-[12px] leading-snug text-foreground sm:text-[13px]">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-foreground sm:text-[13px]">
                    {product.price}
                  </p>
                  {product.compareAtPrice ? (
                    <p className="text-[11px] text-foreground/45 line-through sm:text-[12px]">
                      {product.compareAtPrice}
                    </p>
                  ) : null}
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {filteredProducts.length === 0 ? (
        <p className="py-16 text-center text-[13px] text-foreground/60">
          No products found.
        </p>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hrefForPage={hrefForPage}
        />
      )}
    </div>
  );
}
