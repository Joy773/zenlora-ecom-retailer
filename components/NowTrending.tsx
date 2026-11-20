import TrendingVideo from "./trending-video";

const trendingVideos = [
  {
    src: "/trending/1.mp4",
    poster: "/trending/1.jpg",
    label: "celimax the vita-a retinal shot tightening booster ",
  },
  {
    src: "/trending/2.mp4",
    poster: "/trending/2.jpg",
    label: "arencia vitamin c booster shot",
  },
  {
    src: "/trending/3.mp4",
    poster: "/trending/3.jpg",
    label: "medicube Kojic Acid Turmeric Niacinamide Serum 30ml",
  },
  {
    src: "/trending/4.mp4",
    poster: "/trending/4.jpg",
    label: "The Medicube Capsule Cream Lineup",
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
              <TrendingVideo src={video.src} poster={video.poster} label={video.label} />
            </div>
            <p className="mt-3 text-[13px] font-semibold text-foreground/80">{video.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
