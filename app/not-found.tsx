import Button from "@/components/common/button";

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center md:px-16 lg:px-20 lg:py-28">
      <p
        aria-hidden
        className="bg-gradient-to-r from-accent via-[#c49a9a] to-primary bg-clip-text text-[7rem] leading-none font-bold tracking-tight text-transparent sm:text-[9rem] md:text-[11rem]"
      >
        404
      </p>

      <h1 className="mt-6 text-xl font-bold tracking-[0.08em] text-foreground uppercase sm:text-2xl">
        Opps! Page not found
      </h1>

      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground/60">
        Sorry, the page you&apos;re looking for doesn&apos;t exist. If you think
        something is broken, report a problem.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button
          href="/"
          variant="accent"
          className="min-w-40 uppercase tracking-[0.12em]"
        >
          Return Home
        </Button>
      </div>
    </section>
  );
}
