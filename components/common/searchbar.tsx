"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import { formatPrice } from "@/lib/format-price";

export default function Searchbar({
  placeholder = "Search products",
  basePath = "/skincare",
  showResults = false,
}: {
  placeholder?: string;
  basePath?: string;
  showResults?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<
    { name: string; href: string; image: string; price: string }[]
  >([]);

  useEffect(() => {
    if (!showResults || !query.trim()) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/product-search?q=${encodeURIComponent(query.trim())}`, {
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : { products: [] }))
        .then((data: { products?: typeof results }) => {
          setResults(data.products ?? []);
        })
        .catch(() => {
          if (!controller.signal.aborted) setResults([]);
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, showResults]);

  const clearSearch = () => {
    setQuery("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    const next = params.toString();
    router.push(next ? `${basePath}?${next}` : basePath);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    params.delete("page");

    const next = params.toString();
    router.push(next ? `${basePath}?${next}` : basePath);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <div className="relative">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/50" />
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-primary bg-white py-3 pr-10 pl-10 text-[13px] font-medium text-foreground outline-none transition-colors placeholder:text-foreground/40 hover:border-accent focus:border-accent [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 flex h-5 w-5 items-center justify-center text-foreground/50 transition-colors hover:text-foreground"
            >
              <HiOutlineXMark className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </form>
      {showResults && query.trim() ? (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-primary bg-white shadow-lg">
          {results.length > 0 ? (
            results.map((result) => (
              <Link
                key={result.href}
                href={result.href}
                className="flex items-center gap-3 border-b border-primary/60 px-3 py-2.5 last:border-b-0 hover:bg-primary/30"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#f2f2f0]">
                  {result.image ? (
                    <Image src={result.image} alt="" fill className="object-cover" sizes="48px" />
                  ) : null}
                </div>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {result.name}
                </span>
                <span className="shrink-0 text-sm font-semibold">{formatPrice(result.price)}</span>
              </Link>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-foreground/60">No products found.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
