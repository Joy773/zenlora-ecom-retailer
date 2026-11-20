"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineChevronDown } from "react-icons/hi2";

import { mainCategories, type Subcategory } from "@/lib/product-categories";
export { mainCategories } from "@/lib/product-categories";

function findSelectedLabel(
  category: string | null,
  type: string | null,
  concern: string | null,
) {
  if (!category || category === "all") return null;

  const main = mainCategories.find((item) => item.value === category);
  if (!main) return null;

  if (!type && !concern) return main.label;

  for (const group of main.groups) {
    const match = group.items.find(
      (item) =>
        (type && item.param === "type" && item.value === type) ||
        (concern && item.param === "concern" && item.value === concern),
    );
    if (match) return `${main.label} · ${match.label}`;
  }

  return main.label;
}

export default function AdminCategory({
  basePath = "/admin/products",
}: {
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const concern = searchParams.get("concern");
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(category);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel = findSelectedLabel(category, type, concern);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const pushParams = (nextCategory: string | null, subcategory?: Subcategory) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("concern");

    params.delete("page");

    if (!nextCategory || nextCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", nextCategory);
      if (subcategory) {
        params.set(subcategory.param, subcategory.value);
      }
    }

    const next = params.toString();
    router.push(next ? `${basePath}?${next}` : basePath);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="relative w-full max-w-xl">
      <label htmlFor="admin-product-category" className="sr-only">
        Choose category
      </label>
      <button
        id="admin-product-category"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex w-full items-center justify-between gap-3 rounded-full border border-primary bg-white py-2.5 pr-4 pl-4 text-left text-[13px] font-medium text-foreground outline-none transition-colors hover:border-accent focus:border-accent"
      >
        <span
          className={
            selectedLabel ? "text-foreground" : "text-foreground/40"
          }
        >
          {selectedLabel ?? "Select category"}
        </span>
        <HiOutlineChevronDown
          className={`h-4 w-4 shrink-0 text-foreground/50 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label="Categories"
          className="absolute top-full left-0 z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-primary bg-white py-1"
        >
          <button
            type="button"
            role="option"
            aria-selected={!category}
            onClick={() => pushParams("all")}
            className={`flex w-full px-4 py-2.5 text-left text-[13px] transition-colors ${
              !category
                ? "bg-primary/50 text-accent"
                : "text-foreground/70 hover:bg-primary/30 hover:text-foreground"
            }`}
          >
            All products
          </button>

          {mainCategories.map((main) => {
            const isExpanded = expanded === main.value;
            const isMainActive = category === main.value && !type && !concern;

            return (
              <div key={main.value} className="border-t border-foreground/10">
                <div className="flex items-center">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isMainActive}
                    onClick={() => pushParams(main.value)}
                    className={`min-w-0 flex-1 px-4 py-2.5 text-left text-[13px] font-medium transition-colors ${
                      isMainActive
                        ? "bg-primary/50 text-accent"
                        : "text-foreground hover:bg-primary/30"
                    }`}
                  >
                    {main.label}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((current) =>
                        current === main.value ? null : main.value,
                      )
                    }
                    aria-label={`${isExpanded ? "Hide" : "Show"} ${main.label} subcategories`}
                    aria-expanded={isExpanded}
                    className="flex h-10 w-10 shrink-0 items-center justify-center text-foreground/50 transition-colors hover:text-foreground"
                  >
                    <HiOutlineChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {isExpanded ? (
                  <div className="bg-background/80 pb-2">
                    {main.groups.map((group) => (
                      <div key={group.title} className="mt-2">
                        <p className="px-4 py-1 text-[11px] font-bold tracking-[0.12em] text-accent uppercase">
                          {group.title}
                        </p>
                        <ul>
                          {group.items.map((item) => {
                            const isActive =
                              category === main.value &&
                              ((item.param === "type" && type === item.value) ||
                                (item.param === "concern" &&
                                  concern === item.value));

                            return (
                              <li key={`${item.param}-${item.value}`}>
                                <button
                                  type="button"
                                  role="option"
                                  aria-selected={isActive}
                                  onClick={() => pushParams(main.value, item)}
                                  className={`flex w-full px-4 py-2 text-left text-[13px] transition-colors ${
                                    isActive
                                      ? "bg-primary/50 text-accent"
                                      : "text-foreground/70 hover:bg-primary/30 hover:text-foreground"
                                  }`}
                                >
                                  {item.label}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
