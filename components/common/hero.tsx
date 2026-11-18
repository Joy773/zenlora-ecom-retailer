import Image from "next/image";

const desktopHero = {
  src: "/hero/skincare-desktop.jpg",
  alt: "Zenlora Skincare with the message Achieving healthy, beautiful skin over skincare bottles behind a rain-speckled window.",
};

export default function Hero() {
  return (
    <section
      aria-label="Zenlora skincare feature"
      className="relative min-h-[32rem] overflow-hidden bg-[#9A7256] md:aspect-video md:min-h-0"
    >
      <div className="absolute inset-0 hidden md:block">
        <Image
          src={desktopHero.src}
          alt={desktopHero.alt}
          fill
          className="object-cover"
          preload
          sizes="100vw"
        />
      </div>

      <video
        className="absolute inset-0 h-full w-full object-cover md:hidden"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Zenlora skincare collection"
      >
        <source src="/hero/skincare-mobile.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
