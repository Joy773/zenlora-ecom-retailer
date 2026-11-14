import Image from "next/image";
import { ShopNowButton, ShopTheBrandButton } from "./button";

const slide = {
  brand: "Body Care Edit",
  title: "Soft skin, head to toe",
  description:
    "Dermatologist-trusted body wash and lotions for rough, dry, and itchy skin. Cleanse, soothe, and lock in 48-hour moisture.",
  image: "/hero/body-care-trio.jpg",
  alt: "CeraVe SA Body Wash, Lubriderm Advanced Therapy Lotion, and Palmer's Coconut Oil Formula lotion on a stone surface",
};

export default function Hero() {
  return (
    <section className="relative min-h-[32rem] overflow-hidden bg-[#EDD9C7] md:min-h-[38rem] md:bg-background lg:min-h-[42rem]">
      <div className="absolute inset-0 hidden md:block">
        <Image
          src={slide.image}
          alt={slide.alt}
          fill
          className="object-cover object-[70%_center] md:object-center"
          preload
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 flex min-h-[32rem] w-full items-center justify-center px-8 py-16 md:min-h-[38rem] md:justify-start md:px-16 lg:min-h-[42rem] lg:px-20">
        <div className="max-w-fit text-center md:text-left">
          <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
            {slide.brand}
          </p>
          <h1 className="mt-4 whitespace-nowrap text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/80 md:max-w-lg md:text-lg">
            {slide.description}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <ShopNowButton />
            <ShopTheBrandButton />
          </div>
        </div>
      </div>
    </section>
  );
}
