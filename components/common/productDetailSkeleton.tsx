export default function ProductDetailSkeleton() {
  return (
    <section role="status" className="bg-white px-8 py-10 sm:py-14 md:px-16 lg:px-20 lg:py-16">
      <span className="sr-only">Loading product details…</span>
      <div aria-hidden="true" className="grid items-start gap-10 motion-safe:animate-pulse md:grid-cols-2 md:gap-14 lg:gap-20">
        <div className="aspect-square bg-[#f6e7e2] md:w-[92%]" />
        <div>
          <div className="h-9 w-4/5 rounded bg-foreground/10" />
          <div className="mt-4 h-6 w-24 rounded bg-foreground/10" />
          <div className="mt-6 h-10 w-40 bg-foreground/10" />
          <div className="mt-5 h-4 w-20 rounded bg-foreground/10" />
          <div className="mt-5 flex gap-3">
            <div className="h-11 w-28 bg-foreground/10" />
            <div className="h-11 w-32 rounded-full bg-accent/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
