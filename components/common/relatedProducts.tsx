import Image from "next/image";
import Link from "next/link";
import type { StoreProduct } from "@/lib/store-products";
import { formatPrice } from "@/lib/format-price";
import { ProductCardAddToCartIcon } from "./productCartActions";

export default function RelatedProducts({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white px-8 py-12 md:px-16 lg:px-20 lg:py-16">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        You may also like
      </p>
      <h2 className="mt-2 font-serif text-4xl italic leading-none text-foreground md:text-5xl">
        Related products
      </h2>

      <div className="mt-8 overflow-x-auto overscroll-contain pb-3">
        <ul className="flex flex-nowrap gap-4 md:gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex h-full min-w-0 flex-none basis-[calc((100%-1rem)/2)] flex-col sm:basis-[calc((100%-2rem)/3)] lg:basis-[calc((100%-4.5rem)/4)]"
            >
            <div className="relative">
              <Link href={product.href} className="group block">
                <div className="relative aspect-square overflow-hidden bg-[#eceae6]">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                    />
                  ) : null}
                </div>
              </Link>
              <ProductCardAddToCartIcon
                product={{
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  alt: product.alt,
                  href: product.href,
                }}
              />
            </div>
            <Link href={product.href} className="mt-2 block">
              <p className="line-clamp-2 min-h-10 text-[13px] leading-tight text-foreground transition-colors hover:text-accent">
                {product.name}
              </p>
              <p className="text-[14px] font-semibold leading-tight text-foreground">{formatPrice(product.price)}</p>
              {product.compareAtPrice ? (
                <p className="text-xs text-foreground/45 line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              ) : null}
            </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
