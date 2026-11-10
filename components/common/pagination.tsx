"use client";

import Link from "next/link";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

export default function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
}: {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Product pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:mt-10 sm:gap-2"
    >
      <Link
        href={hrefForPage(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors sm:h-9 sm:w-9 ${
          currentPage === 1
            ? "pointer-events-none opacity-40"
            : "hover:border-accent hover:text-accent"
        }`}
        aria-label="Previous page"
      >
        <HiOutlineChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <Link
            key={page}
            href={hrefForPage(page)}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-[12px] font-medium transition-colors sm:h-9 sm:min-w-9 sm:text-[13px] ${
              isActive
                ? "bg-accent text-white"
                : "border border-foreground/15 text-foreground hover:border-accent hover:text-accent"
            }`}
          >
            {page}
          </Link>
        );
      })}

      <Link
        href={hrefForPage(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors sm:h-9 sm:w-9 ${
          currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:border-accent hover:text-accent"
        }`}
        aria-label="Next page"
      >
        <HiOutlineChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
