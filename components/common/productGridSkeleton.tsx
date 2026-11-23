export default function ProductGridSkeleton({ singleRow = false }: { singleRow?: boolean }) {
  return (
    <div role="status">
      <span className="sr-only">Loading products…</span>
      <div
        aria-hidden="true"
        className={singleRow
          ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 [&>:nth-child(3)]:hidden sm:[&>:nth-child(3)]:block [&>:nth-child(4)]:hidden lg:[&>:nth-child(4)]:block"
          : "grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 md:gap-8"}
      >
        {Array.from({ length: singleRow ? 4 : 6 }, (_, index) => (
          <div key={index} className="motion-safe:animate-pulse">
            <div className="aspect-square bg-[#f2f2f0]" />
            <div className="mt-2 flex h-5 items-start justify-between gap-3">
              <div className="h-3 w-3/5 rounded bg-foreground/10" />
              <div className="h-3 w-1/5 rounded bg-foreground/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductListingSkeleton() {
  return (
    <section className="bg-white px-4 py-10 sm:px-8 sm:py-14 md:px-16 lg:px-20 lg:py-16">
      <div className="lg:ml-[19rem]">
        <div aria-hidden="true" className="mb-10 space-y-4 motion-safe:animate-pulse">
          <div className="h-10 w-48 rounded bg-foreground/10 md:h-14" />
          <div className="h-4 w-3/4 max-w-sm rounded bg-foreground/10" />
        </div>
        <ProductGridSkeleton />
      </div>
    </section>
  );
}
