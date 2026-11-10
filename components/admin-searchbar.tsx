"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";

export default function AdminSearchbar({
  placeholder = "Search products",
  basePath = "/admin/products",
}: {
  placeholder?: string;
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const clearSearch = () => {
    setQuery("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
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

    const next = params.toString();
    router.push(next ? `${basePath}?${next}` : basePath);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <label htmlFor="admin-product-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <HiOutlineMagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground/50" />
        <input
          id="admin-product-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-primary bg-white py-2.5 pr-10 pl-10 text-[13px] font-medium text-foreground outline-none transition-colors placeholder:text-foreground/40 hover:border-accent focus:border-accent [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        />
        {query ? (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-foreground/50 transition-colors hover:text-foreground"
          >
            <HiOutlineXMark className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </form>
  );
}
