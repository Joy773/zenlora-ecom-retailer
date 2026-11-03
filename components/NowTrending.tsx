const trendingVideos = [
  {
    src: "/trending/1.mp4",
    label: "Glow ritual",
  },
  {
    src: "/trending/2.mp4",
    label: "Daily SPF",
  },
  {
    src: "/trending/3.mp4",
    label: "Serum moment",
  },
  {
    src: "/trending/4.mp4",
    label: "Skin reset",
  },
];

export default function NowTrending() {
  return (
    <section className="bg-white py-16 md:px-16 lg:px-20 lg:py-20">
      <div className="flex flex-col items-center px-8 text-center md:px-0">
        <h2 className="font-serif text-5xl font-normal italic leading-none text-foreground md:text-[3.5rem]">
          Now Trending
        </h2>
        <p className="mt-5 max-w-md text-[13px] leading-relaxed text-foreground/60">
          Short looks at the formulas everyone is reaching for right now. Glow,
          protect, and repair.
        </p>
      </div>

      <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-8 pb-2 scroll-px-8 [scrollbar-width:thin] md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:gap-6">
        {trendingVideos.map((video) => (
          <li
            key={video.src}
            className="w-[calc(100vw-4rem)] shrink-0 snap-start md:w-auto"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#f2f2f0]">
              <video
                src={video.src}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={video.label}
              />
            </div>
            <p className="mt-3 text-[13px] text-foreground">{video.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
