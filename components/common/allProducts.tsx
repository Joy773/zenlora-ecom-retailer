import Image from "next/image";
import Link from "next/link";
import { getStoreProducts, type StoreProduct } from "@/lib/store-products";
import { formatPrice } from "@/lib/format-price";
import { ProductCardAddToCartIcon } from "./productCartActions";

export type Product = Pick<
  StoreProduct,
  | "href"
  | "name"
  | "price"
  | "compareAtPrice"
  | "discount"
  | "image"
  | "alt"
  | "slug"
  | "description"
  | "isNewArrival"
  | "isOffer"
>;

function toCartProduct(product: Product) {
  return {
    slug: product.slug ?? product.href.replace(/^\/product\//, ""),
    name: product.name,
    price: product.price,
    image: product.image,
    alt: product.alt,
    href: product.href,
  };
}

function ProductCard({
  product,
  imageBg = "bg-[#eceae6]",
  sizes = "(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 16vw",
}: {
  product: Product;
  imageBg?: string;
  sizes?: string;
}) {
  const productHref = product.slug
    ? `/product/${encodeURIComponent(product.slug)}`
    : product.href;
  const cartProduct = { ...toCartProduct(product), href: productHref };

  return (
    <div className="flex h-full flex-col">
      <div className="relative">
        <Link href={productHref} className="group block">
          <div className={`relative aspect-square overflow-hidden ${imageBg}`}>
            {product.image ? (
              <Image
                src={product.image}
                alt={product.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes={sizes}
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
        <ProductCardAddToCartIcon product={cartProduct} />
      </div>
      <div className="mt-2">
        <Link href={productHref}>
          <p className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-tight text-foreground transition-colors hover:text-accent">
            {product.name}
          </p>
          <p className="text-[14px] font-semibold leading-tight text-foreground">{formatPrice(product.price)}</p>
          {product.compareAtPrice ? (
            <p className="text-[12px] text-foreground/45 line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          ) : null}
        </Link>
      </div>
    </div>
  );
}

function SplitCategory({
  title,
  description,
  shopHref,
  shopLabel,
  products,
  portrait,
  imageSide = "right",
}: {
  title: string;
  description: string;
  shopHref: string;
  shopLabel: string;
  products: Product[];
  portrait: { src: string; alt: string; priority?: boolean; className?: string };
  imageSide?: "left" | "right";
}) {
  const imageCol =
    imageSide === "left"
      ? "lg:col-start-1 lg:row-start-1 lg:row-span-2"
      : "lg:col-start-2 lg:row-start-1 lg:row-span-2";
  const copyCol =
    imageSide === "left"
      ? "lg:col-start-2 lg:row-start-1"
      : "lg:col-start-1 lg:row-start-1";
  const productsCol =
    imageSide === "left"
      ? "lg:col-start-2 lg:row-start-2 lg:self-end"
      : "lg:col-start-1 lg:row-start-2 lg:self-end";

  return (
    <section className="bg-white">
      <div className="grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:min-h-[38rem] xl:min-h-[44rem]">
        <div
          className={`${copyCol} px-8 pt-4 pb-8 md:px-16 md:pt-16 lg:px-20 lg:pt-20 lg:pb-0`}
        >
          <h2 className="font-serif text-5xl font-normal italic leading-none text-foreground md:text-[3.5rem]">
            {title}
          </h2>
          <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-foreground/60">
            {description}
          </p>
          <Link
            href={shopHref}
            className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-foreground"
          >
            {shopLabel}
            <svg
              aria-hidden
              viewBox="0 0 8 10"
              className="h-2.5 w-2 fill-current"
            >
              <path d="M0 0l8 5-8 5V0z" />
            </svg>
          </Link>
        </div>

        <div
          className={`relative mx-auto aspect-[4/5] w-[calc(100%-4rem)] overflow-hidden md:w-[calc(100%-8rem)] lg:aspect-auto lg:h-full lg:min-h-full lg:w-full ${imageCol}`}
        >
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            className={portrait.className ?? "object-cover object-center"}
            sizes="(max-width: 1024px) calc(100vw - 4rem), 50vw"
            priority={portrait.priority}
          />
        </div>

        <ul
          className={`${productsCol} grid grid-cols-2 gap-3 px-5 pt-5 pb-12 md:grid-cols-3 md:gap-5 md:px-16 md:pt-8 md:pb-16 lg:px-20 lg:pt-0 lg:pb-20`}
        >
          {products.map((product) => (
            <li key={product.href} className="h-full">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CategoryListing({
  title,
  description,
  toolbar,
  sidebar,
  children,
}: {
  title: string;
  description: string;
  toolbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-white px-4 py-10 sm:px-8 sm:py-14 md:px-16 lg:px-20 lg:py-16">
      <div className="grid gap-x-0 gap-y-3 lg:grid-cols-[16rem_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-x-12 lg:gap-y-10">
        <div className="order-1 flex flex-col gap-5 sm:gap-6 md:flex-row md:items-end md:justify-between md:gap-10 lg:col-start-2 lg:row-start-1">
          <div className="min-w-0 text-left">
            <h1 className="font-serif text-4xl font-normal italic leading-none text-foreground sm:text-5xl md:text-[3.5rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-foreground/60 sm:mt-5 md:whitespace-nowrap">
              {description}
            </p>
          </div>

          {toolbar ? (
            <div className="w-full md:max-w-sm md:shrink-0">{toolbar}</div>
          ) : null}
        </div>

        {sidebar ? (
          <div className="order-2 lg:col-start-1 lg:row-start-2 lg:h-full">
            {sidebar}
          </div>
        ) : null}

        {children ? (
          <div className="order-3 mt-5 min-w-0 lg:col-start-2 lg:row-start-2 lg:mt-0">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function SkincareProducts({
  toolbar,
  sidebar,
  children,
}: {
  toolbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <CategoryListing
      title="Skincare"
      description="Cleansers, moisturizers, serums, and sun care for calm, balanced routines."
      toolbar={toolbar}
      sidebar={sidebar}
    >
      {children}
    </CategoryListing>
  );
}

export function HaircareProducts({
  toolbar,
  sidebar,
  children,
}: {
  toolbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <CategoryListing
      title="Haircare"
      description="Shampoo, oils, serums, and styling care for soft, healthy hair."
      toolbar={toolbar}
      sidebar={sidebar}
    >
      {children}
    </CategoryListing>
  );
}

export function MakeupProducts({
  toolbar,
  sidebar,
  children,
}: {
  toolbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <CategoryListing
      title="Makeup"
      description="Face, eyes, lips, and tools for everyday color and finish."
      toolbar={toolbar}
      sidebar={sidebar}
    >
      {children}
    </CategoryListing>
  );
}

export default async function AllProducts() {
  const [sunscreenProducts, serumProducts, featuredProducts] =
    await Promise.all([
      getStoreProducts({
        category: "skincare",
        type: "sunscreen",
        limit: 3,
      }),
      getStoreProducts({
        category: "skincare",
        type: "serum-oils",
        limit: 3,
      }),
      getStoreProducts({ limit: 6 }),
    ]);

  return (
    <div className="flex flex-col gap-10 bg-white pt-2 md:gap-14 md:pt-14">
      <SplitCategory
        title="Sunscreen"
        description="Lightweight, broad-spectrum formulas designed to protect, hydrate, and wear all day. Without a white cast."
        shopHref="/skincare?type=sunscreen"
        shopLabel="Shop All Sunscreen"
        products={sunscreenProducts}
        portrait={{
          src: "/products/portrait.jpg",
          alt: "Close-up of a woman with glowing, protected skin",
          priority: true,
        }}
        imageSide="right"
      />
      <SplitCategory
        title="Serum / Oils"
        description="Concentrated treatments designed to brighten, repair, and plump. A few drops at a time."
        shopHref="/skincare?type=serum-oils"
        shopLabel="Shop All Serum / Oils"
        products={serumProducts}
        portrait={{
          src: "/products/serum-portrait.jpg",
          alt: "Woman drawing serum from an amber dropper bottle",
          className: "object-cover object-[center_20%]",
        }}
        imageSide="left"
      />

      <section className="bg-white px-8 py-16 md:px-16 lg:px-20 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-serif text-5xl font-normal italic leading-none text-foreground md:text-[3.5rem]">
            Feature Products
          </h2>
          <p className="mt-5 max-w-md text-[13px] leading-relaxed text-foreground/60">
            Handpicked essentials for everyday glow. From soft cleansers to
            last-step sun care.
          </p>
          <Link
            href="/skincare"
            className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-foreground"
          >
            Show All Products
            <svg
              aria-hidden
              viewBox="0 0 8 10"
              className="h-2.5 w-2 fill-current"
            >
              <path d="M0 0l8 5-8 5V0z" />
            </svg>
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-8 lg:gap-10">
          {featuredProducts.map((product) => (
            <li key={product.href}>
              <ProductCard
                product={product}
                imageBg="bg-[#f2f2f0]"
                sizes="(max-width: 768px) 45vw, 33vw"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
