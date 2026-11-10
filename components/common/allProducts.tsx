import Image from "next/image";
import Link from "next/link";
import { ProductCardAddToCart } from "./productCartActions";

export type Product = {
  href: string;
  name: string;
  price: string;
  compareAtPrice?: string;
  image: string;
  alt: string;
  slug?: string;
  description?: string;
};

function defaultCompareAtPrice(price: string) {
  const value = Number(price.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(value)) return undefined;
  return `$${Math.round(value + 6)}`;
}

function expandProducts(base: Product[]): Product[] {
  return Array.from({ length: 3 }, (_, setIndex) =>
    base.map((product) => {
      const slug =
        setIndex === 0
          ? (product.slug ?? "product")
          : `${product.slug ?? "product"}-${setIndex + 1}`;

      return {
        ...product,
        slug,
        href: `/product/${slug}`,
        name: setIndex === 0 ? product.name : `${product.name} ${setIndex + 1}`,
        compareAtPrice:
          product.compareAtPrice ?? defaultCompareAtPrice(product.price),
      };
    }),
  ).flat();
}

const sunscreenProducts: Product[] = [
  {
    slug: "daily-spf",
    href: "/product/daily-spf",
    name: "Daily SPF 50 Lotion",
    price: "$19",
    image: "/products/spf-daily.jpg",
    alt: "White bottles of daily SPF 50 sunscreen lotion",
  },
  {
    slug: "body-spf",
    href: "/product/body-spf",
    name: "Everyday Body SPF 50",
    price: "$19",
    image: "/products/spf-body.jpg",
    alt: "Coral tube of SPF 50 body sunscreen next to its box",
  },
  {
    slug: "sun-block",
    href: "/product/sun-block",
    name: "Sensitive Sun Block",
    price: "$16",
    image: "/products/spf-block.jpg",
    alt: "Tubes of sensitive-skin sun block and blemish balm",
  },
];

const serumProducts: Product[] = [
  {
    slug: "glow-serum",
    href: "/product/glow-serum",
    name: "24K Glow Serum",
    price: "$19",
    image: "/products/serum.jpg",
    alt: "Gold-capped dropper bottle of glow serum",
  },
  {
    slug: "repair-serum",
    href: "/product/repair-serum",
    name: "Repair Dropper Serum",
    price: "$19",
    image: "/products/serum-repair.jpg",
    alt: "Amber dropper bottle of repair serum with a rose",
  },
  {
    slug: "vitamin-c-serum",
    href: "/product/vitamin-c-serum",
    name: "Vitamin C Serum",
    price: "$16",
    image: "/products/serum-oil.jpg",
    alt: "Open glass bottle of vitamin C serum with a dropper",
  },
];

const featuredProducts: Product[] = [
  {
    slug: "daily-spf",
    href: "/product/daily-spf",
    name: "Daily SPF 50 Lotion",
    price: "$19",
    image: "/products/spf-daily.jpg",
    alt: "White bottles of daily SPF 50 sunscreen lotion",
  },
  {
    slug: "glow-serum",
    href: "/product/glow-serum",
    name: "24K Glow Serum",
    price: "$19",
    image: "/products/serum.jpg",
    alt: "Gold-capped dropper bottle of glow serum",
  },
  {
    slug: "daily-moisturizer",
    href: "/product/daily-moisturizer",
    name: "Daily Moisturizer",
    price: "$18",
    image: "/products/moisturizer.jpg",
    alt: "Jar of daily face moisturizer on a studio surface",
  },
  {
    slug: "body-spf",
    href: "/product/body-spf",
    name: "Everyday Body SPF 50",
    price: "$19",
    image: "/products/spf-body.jpg",
    alt: "Coral tube of SPF 50 body sunscreen next to its box",
  },
  {
    slug: "repair-serum",
    href: "/product/repair-serum",
    name: "Repair Dropper Serum",
    price: "$19",
    image: "/products/serum-repair.jpg",
    alt: "Amber dropper bottle of repair serum with a rose",
  },
  {
    slug: "double-cleanse",
    href: "/product/double-cleanse",
    name: "Double Cleanse Duo",
    price: "$22",
    image: "/products/double-cleanse.jpg",
    alt: "Two cleanser bottles for a double cleanse routine",
  },
];

const skincareProductBase: Product[] = [
  {
    slug: "double-cleanse",
    href: "/product/double-cleanse",
    name: "Double Cleanse Duo",
    price: "$22",
    image: "/products/double-cleanse.jpg",
    alt: "Two cleanser bottles for a double cleanse routine",
    description:
      "A gentle double-cleanse pairing that lifts SPF, oil, and daily buildup without stripping the barrier.",
  },
  {
    slug: "daily-moisturizer",
    href: "/product/daily-moisturizer",
    name: "Daily Moisturizer",
    price: "$18",
    image: "/products/moisturizer.jpg",
    alt: "Jar of daily face moisturizer on a studio surface",
    description:
      "Lightweight daily hydration that softens skin and supports a calm, balanced finish.",
  },
  {
    slug: "glow-serum",
    href: "/product/glow-serum",
    name: "24K Glow Serum",
    price: "$19",
    image: "/products/serum.jpg",
    alt: "Gold-capped dropper bottle of glow serum",
    description:
      "A luminous serum drop that brightens dull skin and leaves a soft, healthy glow.",
  },
  {
    slug: "repair-serum",
    href: "/product/repair-serum",
    name: "Repair Dropper Serum",
    price: "$19",
    image: "/products/serum-repair.jpg",
    alt: "Amber dropper bottle of repair serum with a rose",
    description:
      "Concentrated repair drops that soothe, replenish, and help skin bounce back.",
  },
  {
    slug: "vitamin-c-serum",
    href: "/product/vitamin-c-serum",
    name: "Vitamin C Serum",
    price: "$16",
    image: "/products/serum-oil.jpg",
    alt: "Open glass bottle of vitamin C serum with a dropper",
    description:
      "An antioxidant serum for clearer tone and everyday radiance.",
  },
  {
    slug: "daily-spf",
    href: "/product/daily-spf",
    name: "Daily SPF 50 Lotion",
    price: "$19",
    image: "/products/spf-daily.jpg",
    alt: "White bottles of daily SPF 50 sunscreen lotion",
    description:
      "Broad-spectrum daily SPF that protects without a heavy white cast.",
  },
  {
    slug: "body-spf",
    href: "/product/body-spf",
    name: "Everyday Body SPF 50",
    price: "$19",
    image: "/products/spf-body.jpg",
    alt: "Coral tube of SPF 50 body sunscreen next to its box",
    description:
      "Easy-wear body sunscreen for lasting protection from face to toe.",
  },
  {
    slug: "sun-block",
    href: "/product/sun-block",
    name: "Sensitive Sun Block",
    price: "$16",
    image: "/products/spf-block.jpg",
    alt: "Tubes of sensitive-skin sun block and blemish balm",
    description:
      "A gentle sun block formula made for sensitive and reactive skin.",
  },
];

export const skincareProducts: Product[] = expandProducts(skincareProductBase);

export const SKINCARE_PAGE_SIZE = 9;
export const HAIRCARE_PAGE_SIZE = 9;
export const MAKEUP_PAGE_SIZE = 9;

const haircareProductBase: Product[] = [
  {
    slug: "daily-shampoo",
    href: "/product/daily-shampoo",
    name: "Daily Soft Shampoo",
    price: "$18",
    image: "/products/double-cleanse.jpg",
    alt: "Bottles of daily soft shampoo for clean hair",
    description:
      "A soft daily cleanse that refreshes the scalp and leaves hair light and touchable.",
  },
  {
    slug: "repair-conditioner",
    href: "/product/repair-conditioner",
    name: "Repair Conditioner",
    price: "$18",
    image: "/products/moisturizer.jpg",
    alt: "Jar of repair conditioner cream",
    description:
      "Rich conditioner that detangles, softens, and helps repair dry lengths.",
  },
  {
    slug: "nourish-hair-oil",
    href: "/product/nourish-hair-oil",
    name: "Nourish Hair Oil",
    price: "$20",
    image: "/products/serum-oil.jpg",
    alt: "Glass bottle of nourishing hair oil",
    description:
      "A nourishing hair oil for shine, softness, and frizz control.",
  },
  {
    slug: "silk-hair-serum",
    href: "/product/silk-hair-serum",
    name: "Silk Hair Serum",
    price: "$19",
    image: "/products/serum.jpg",
    alt: "Dropper bottle of silk hair serum",
    description:
      "Silky serum that smooths flyaways and adds a polished finish.",
  },
  {
    slug: "deep-mask",
    href: "/product/deep-mask",
    name: "Deep Repair Hair Mask",
    price: "$22",
    image: "/products/serum-repair.jpg",
    alt: "Jar of deep repair hair mask",
    description:
      "A deep repair mask that restores moisture to dry, stressed hair.",
  },
  {
    slug: "volume-spray",
    href: "/product/volume-spray",
    name: "Volume Hair Spray",
    price: "$16",
    image: "/products/spf-body.jpg",
    alt: "Tube of volume hair spray",
    description:
      "Lightweight spray for lift and lasting volume without crunch.",
  },
  {
    slug: "color-protect",
    href: "/product/color-protect",
    name: "Color Protect Duo",
    price: "$24",
    image: "/products/spf-daily.jpg",
    alt: "Color protect shampoo and conditioner duo",
    description:
      "A color-protect duo that cleanses gently and helps fade stay longer.",
  },
  {
    slug: "anti-frizz",
    href: "/product/anti-frizz",
    name: "Anti-Frizz Cream",
    price: "$17",
    image: "/products/spf-block.jpg",
    alt: "Tube of anti-frizz hair cream",
    description:
      "Anti-frizz cream that tames dryness and keeps hair soft all day.",
  },
];

export const haircareProducts: Product[] = expandProducts(haircareProductBase);

const makeupProductBase: Product[] = [
  {
    slug: "soft-matte-foundation",
    href: "/product/soft-matte-foundation",
    name: "Soft Matte Foundation",
    price: "$24",
    image: "/products/moisturizer.jpg",
    alt: "Jar of soft matte foundation",
    description:
      "Buildable soft-matte coverage that stays comfortable and natural-looking.",
  },
  {
    slug: "glow-highlighter",
    href: "/product/glow-highlighter",
    name: "Glow Highlighter",
    price: "$18",
    image: "/products/serum.jpg",
    alt: "Bottle of glow highlighter",
    description:
      "A luminous highlighter for soft cheek and high-point glow.",
  },
  {
    slug: "velvet-lipstick",
    href: "/product/velvet-lipstick",
    name: "Velvet Lipstick",
    price: "$16",
    image: "/products/serum-repair.jpg",
    alt: "Tube of velvet lipstick",
    description:
      "Velvet lipstick with rich color payoff and a smooth, comfortable wear.",
  },
  {
    slug: "volume-mascara",
    href: "/product/volume-mascara",
    name: "Volume Mascara",
    price: "$17",
    image: "/products/spf-block.jpg",
    alt: "Tube of volume mascara",
    description:
      "Volume mascara that lifts and defines lashes without clumping.",
  },
  {
    slug: "sheer-blush",
    href: "/product/sheer-blush",
    name: "Sheer Blush",
    price: "$15",
    image: "/products/spf-body.jpg",
    alt: "Compact of sheer blush",
    description:
      "Sheer blush for a soft flush that blends easily into skin.",
  },
  {
    slug: "lip-gloss-oil",
    href: "/product/lip-gloss-oil",
    name: "Lip Gloss Oil",
    price: "$14",
    image: "/products/serum-oil.jpg",
    alt: "Bottle of lip gloss oil",
    description:
      "Glossy lip oil that hydrates while adding a glassy shine.",
  },
  {
    slug: "setting-spray",
    href: "/product/setting-spray",
    name: "All-Day Setting Spray",
    price: "$19",
    image: "/products/spf-daily.jpg",
    alt: "Bottle of all-day setting spray",
    description:
      "A fine mist setting spray that locks makeup for all-day wear.",
  },
  {
    slug: "brush-set",
    href: "/product/brush-set",
    name: "Essential Brush Set",
    price: "$28",
    image: "/products/double-cleanse.jpg",
    alt: "Essential makeup brush set",
    description:
      "An essential brush set for face, eyes, and everyday makeup application.",
  },
];

export const makeupProducts: Product[] = expandProducts(makeupProductBase);

export function getAllProducts(): Product[] {
  return [...skincareProducts, ...haircareProducts, ...makeupProducts];
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((product) => product.slug === slug);
}

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
    ? `/product/${product.slug}`
    : product.href;
  const cartProduct = { ...toCartProduct(product), href: productHref };

  return (
    <div className="flex h-full flex-col">
      <Link href={productHref} className="group block">
        <div className={`relative aspect-square overflow-hidden ${imageBg}`}>
          <Image
            src={product.image}
            alt={product.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={sizes}
          />
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <Link href={productHref} className="min-w-0 flex-1">
          <p className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-snug text-foreground transition-colors hover:text-accent">
            {product.name}
          </p>
          <p className="mt-0.5 text-[13px] text-foreground">{product.price}</p>
        </Link>
        <div className="shrink-0 pt-0.5">
          <ProductCardAddToCart product={cartProduct} />
        </div>
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
    imageSide === "left" ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-1 lg:row-start-1";
  const productsCol =
    imageSide === "left"
      ? "lg:col-start-2 lg:row-start-2 lg:self-end"
      : "lg:col-start-1 lg:row-start-2 lg:self-end";

  return (
    <section className="bg-white">
      <div className="grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:min-h-[38rem] xl:min-h-[44rem]">
        <div className={`${copyCol} px-8 pt-4 pb-8 md:px-16 md:pt-16 lg:px-20 lg:pt-20 lg:pb-0`}>
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

export default function AllProducts() {
  return (
    <div className="flex flex-col gap-10 bg-white pt-2 md:gap-14 md:pt-14">
      <SplitCategory
        title="Sunscreen"
        description="Lightweight, broad-spectrum formulas designed to protect, hydrate, and wear all day. Without a white cast."
        shopHref="/shop?category=sunscreen"
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
        title="Serums"
        description="Concentrated treatments designed to brighten, repair, and plump. A few drops at a time."
        shopHref="/shop?category=serums"
        shopLabel="Shop All Serums"
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
            href="/shop"
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
