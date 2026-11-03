import Image from "next/image";
import Link from "next/link";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";

type Product = {
  href: string;
  name: string;
  price: string;
  image: string;
  alt: string;
};

const sunscreenProducts: Product[] = [
  {
    href: "/shop?product=daily-spf",
    name: "Daily SPF 50 Lotion",
    price: "$19",
    image: "/products/spf-daily.jpg",
    alt: "White bottles of daily SPF 50 sunscreen lotion",
  },
  {
    href: "/shop?product=body-spf",
    name: "Everyday Body SPF 50",
    price: "$19",
    image: "/products/spf-body.jpg",
    alt: "Coral tube of SPF 50 body sunscreen next to its box",
  },
  {
    href: "/shop?product=sun-block",
    name: "Sensitive Sun Block",
    price: "$16",
    image: "/products/spf-block.jpg",
    alt: "Tubes of sensitive-skin sun block and blemish balm",
  },
];

const serumProducts: Product[] = [
  {
    href: "/shop?product=glow-serum",
    name: "24K Glow Serum",
    price: "$19",
    image: "/products/serum.jpg",
    alt: "Gold-capped dropper bottle of glow serum",
  },
  {
    href: "/shop?product=repair-serum",
    name: "Repair Dropper Serum",
    price: "$19",
    image: "/products/serum-repair.jpg",
    alt: "Amber dropper bottle of repair serum with a rose",
  },
  {
    href: "/shop?product=vitamin-c-serum",
    name: "Vitamin C Serum",
    price: "$16",
    image: "/products/serum-oil.jpg",
    alt: "Open glass bottle of vitamin C serum with a dropper",
  },
];

const featuredProducts: Product[] = [
  {
    href: "/shop?product=daily-spf",
    name: "Daily SPF 50 Lotion",
    price: "$19",
    image: "/products/spf-daily.jpg",
    alt: "White bottles of daily SPF 50 sunscreen lotion",
  },
  {
    href: "/shop?product=glow-serum",
    name: "24K Glow Serum",
    price: "$19",
    image: "/products/serum.jpg",
    alt: "Gold-capped dropper bottle of glow serum",
  },
  {
    href: "/shop?product=moisturizer",
    name: "Daily Moisturizer",
    price: "$18",
    image: "/products/moisturizer.jpg",
    alt: "Jar of daily face moisturizer on a studio surface",
  },
  {
    href: "/shop?product=body-spf",
    name: "Everyday Body SPF 50",
    price: "$19",
    image: "/products/spf-body.jpg",
    alt: "Coral tube of SPF 50 body sunscreen next to its box",
  },
  {
    href: "/shop?product=repair-serum",
    name: "Repair Dropper Serum",
    price: "$19",
    image: "/products/serum-repair.jpg",
    alt: "Amber dropper bottle of repair serum with a rose",
  },
  {
    href: "/shop?product=double-cleanse",
    name: "Double Cleanse Duo",
    price: "$22",
    image: "/products/double-cleanse.jpg",
    alt: "Two cleanser bottles for a double cleanse routine",
  },
];

function QuantityIcons() {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span
        aria-hidden
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-foreground/15 text-foreground/70"
      >
        <HiOutlineMinus className="h-3.5 w-3.5" />
      </span>
      <span
        aria-hidden
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-foreground/15 text-foreground/70"
      >
        <HiOutlinePlus className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}

function ProductCard({
  product,
  imageBg = "bg-[#eceae6]",
  sizes = "(max-width: 1024px) 30vw, 16vw",
}: {
  product: Product;
  imageBg?: string;
  sizes?: string;
}) {
  return (
    <div>
      <Link href={product.href} className="group block">
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
        <Link href={product.href} className="min-w-0">
          <p className="text-[13px] text-foreground">{product.name}</p>
          <p className="mt-0.5 text-[13px] text-foreground">{product.price}</p>
        </Link>
        <QuantityIcons />
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
          className={`relative aspect-[2/3] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-full ${imageCol}`}
        >
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            className={portrait.className ?? "object-cover object-center"}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={portrait.priority}
          />
        </div>

        <ul
          className={`${productsCol} grid grid-cols-3 gap-3 px-5 pt-5 pb-12 md:gap-5 md:px-16 md:pt-8 md:pb-16 lg:px-20 lg:pt-0 lg:pb-20`}
        >
          {products.map((product) => (
            <li key={product.href}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
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

        <ul className="mt-10 grid grid-cols-3 gap-3 md:gap-8 lg:gap-10">
          {featuredProducts.map((product) => (
            <li key={product.href}>
              <ProductCard
                product={product}
                imageBg="bg-[#f2f2f0]"
                sizes="(max-width: 768px) 30vw, 33vw"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
