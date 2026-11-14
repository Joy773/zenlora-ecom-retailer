"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

const categories = [
  {
    href: "/skincare?type=cleanser",
    name: "Cleansers",
    image: "/categories/cleanser-provided.png",
    alt: "Bioderma Sebium purifying cleansing foaming gel",
  },
  {
    href: "/skincare?type=toners-astringents",
    name: "Toners",
    image: "/categories/toner-provided.png",
    alt: "Purito oat seed water clarifying facial toner",
  },
  {
    href: "/skincare?type=serum-oils",
    name: "Serum / Oils",
    image: "/categories/serum-provided.png",
    alt: "The Ordinary rose hip seed oil dropper bottle",
  },
  {
    href: "/skincare?type=moisturizers",
    name: "Moisturizers",
    image: "/categories/moisturizer-provided.png",
    alt: "CeraVe daily moisturizing lotion with cream",
  },
  {
    href: "/skincare?type=sunscreen",
    name: "Sunscreen",
    image: "/categories/sunscreen-provided.png",
    alt: "Aveeno Protect and Hydrate SPF 60 sunscreen",
  },
  {
    href: "/skincare?type=masks-peels",
    name: "Masks",
    image: "/categories/mask-provided.png",
    alt: "Medicube Zero Pore blackhead mud mask",
  },
];

export default function Categories() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const syncPageSize = () => setPageSize(media.matches ? 3 : 2);

    syncPageSize();
    media.addEventListener("change", syncPageSize);
    return () => media.removeEventListener("change", syncPageSize);
  }, []);

  const pageCount = Math.ceil(categories.length / pageSize);

  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(pageCount - 1, 0)));
  }, [pageCount]);

  return (
    <section className="bg-white px-8 pt-16 pb-6 md:px-16 md:pb-16 lg:px-20 lg:py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-serif text-5xl font-normal italic leading-none text-foreground md:text-[3.5rem]">
          Categories
        </h2>
        <p className="mt-5 max-w-md text-[13px] leading-relaxed text-foreground/60">
          Find the step you need, from first cleanse to last layer of sun care.
        </p>
        <Link
          href="/skincare"
          className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-foreground"
        >
          Shop All Categories
          <svg
            aria-hidden
            viewBox="0 0 8 10"
            className="h-2.5 w-2 fill-current"
          >
            <path d="M0 0l8 5-8 5V0z" />
          </svg>
        </Link>
      </div>

      <div className="mt-10">
        <div className="overflow-hidden">
          <ul
            className="flex gap-3 transition-transform duration-500 ease-out md:gap-8 lg:gap-10 [--category-gap:0.75rem] md:[--category-gap:2rem] lg:[--category-gap:2.5rem]"
            style={{
              transform: `translateX(calc(-${page} * (100% + var(--category-gap))))`,
            }}
          >
            {categories.map((category) => (
              <li
                key={category.name}
                className="w-[calc((100%-var(--category-gap))/2)] shrink-0 md:w-[calc((100%-2*var(--category-gap))/3)]"
              >
                <Link href={category.href} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-[#f2f2f0]">
                    <Image
                      src={category.image}
                      alt={category.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 45vw, 33vw"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-4 pt-10 pb-4 text-sm font-medium text-white">
                      {category.name}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 md:mt-8">
          <button
            type="button"
            onClick={() =>
              setPage((current) => (current - 1 + pageCount) % pageCount)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f2f0] text-foreground transition-colors hover:bg-primary"
            aria-label="Previous categories"
          >
            <HiOutlineChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => (current + 1) % pageCount)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f2f0] text-foreground transition-colors hover:bg-primary"
            aria-label="Next categories"
          >
            <HiOutlineChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
