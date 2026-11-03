"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { ShopNowButton, ShopTheBrandButton } from "./button";

const slides = [
  {
    brand: "Beauty of Joseon",
    product: "Relief Sun Rice + Probiotics",
    detail: "SPF50+ PA++++",
    title: "Glow, rooted in tradition",
    description:
      "Hanbang-inspired essentials for calm, luminous skin. Explore rice, ginseng, and relief sun favorites.",
    image: "/hero/beauty-of-joseon.jpg",
    alt: "Beauty of Joseon Relief Sun Rice + Probiotics",
  },
  {
    brand: "COSRX",
    product: "Advanced Snail 96 Mucin Power Essence",
    detail: "Snail mucin essence",
    title: "Repair, the gentle way",
    description:
      "The cult snail essence loved across Bangladesh. Lightweight hydration that helps soothe, repair, and bounce skin back.",
    image: "/hero/cosrx.jpg",
    alt: "COSRX Advanced Snail 96 Mucin Power Essence",
  },
  {
    brand: "The Ordinary",
    product: "Niacinamide 10% + Zinc 1%",
    detail: "High-strength vitamin and mineral blemish formula",
    title: "Clinical care, honest formulas",
    description:
      "Single-ingredient actives at a clear price. Niacinamide, acids, and hydration. Nothing extra.",
    image: "/hero/the-ordinary.jpg",
    alt: "The Ordinary Niacinamide 10% + Zinc 1%",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setCurrent((index + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[32rem] overflow-hidden bg-background md:min-h-[38rem] lg:min-h-[42rem]">
      {slides.map((item, index) => (
        <div
          key={item.brand}
          aria-hidden={index !== current}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === current ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt={item.alt}
            fill
            className="object-cover"
            preload={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[32rem] max-w-3xl flex-col items-center justify-center gap-5 px-6 py-20 text-center md:min-h-[38rem] lg:min-h-[42rem]">
        <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
          {slide.brand}
        </p>
        <h1 className="max-w-2xl text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl">
          {slide.title}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg">
          {slide.description}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <ShopNowButton />
          <ShopTheBrandButton />
        </div>
      </div>

      <button
        type="button"
        onClick={() => goTo(current - 1)}
        className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground md:left-4"
        aria-label="Previous slide"
      >
        <HiOutlineChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground md:right-4"
        aria-label="Next slide"
      >
        <HiOutlineChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
}
