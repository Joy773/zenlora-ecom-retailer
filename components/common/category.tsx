"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";

export type CategoryOption = {
  value: string;
  label: string;
  param: "type" | "concern";
  count: number;
};

export type CategoryGroup = {
  title: string;
  options: CategoryOption[];
};

export const skincareCategoryGroups: CategoryGroup[] = [
  {
    title: "Face",
    options: [
      { value: "cleanser", label: "Cleanser / Facewash", param: "type", count: 42 },
      {
        value: "day-night-cream",
        label: "Day Cream / Night Cream",
        param: "type",
        count: 28,
      },
      { value: "masks-peels", label: "Masks & Peels", param: "type", count: 19 },
      { value: "sheet-mask", label: "Sheet Mask", param: "type", count: 34 },
      {
        value: "scrubs-exfoliators",
        label: "Scrubs & Exfoliators",
        param: "type",
        count: 16,
      },
      {
        value: "toners-astringents",
        label: "Toners & Astringents",
        param: "type",
        count: 23,
      },
      { value: "facial-wipes", label: "Facial Wipes / Kit", param: "type", count: 11 },
      {
        value: "serum-oils",
        label: "Serum / Oils",
        param: "type",
        count: 34,
      },
      {
        value: "moisturizers",
        label: "Moisturizers",
        param: "type",
        count: 17,
      },
      { value: "spot-remover", label: "Spot Remover", param: "type", count: 14 },
      { value: "lip-care", label: "Lip Balms / Lip Care", param: "type", count: 22 },
    ],
  },
  {
    title: "K-Beauty",
    options: [
      { value: "sunscreen", label: "Sunscreen", param: "type", count: 31 },
      { value: "essence", label: "Essence", param: "type", count: 18 },
      { value: "ampoule", label: "Ampoule", param: "type", count: 12 },
      { value: "cleansing-oil", label: "Cleansing Oil", param: "type", count: 15 },
      { value: "sleeping-mask", label: "Sleeping Mask", param: "type", count: 9 },
      {
        value: "eye-patch",
        label: "Eye Cream / Gel / Patch",
        param: "type",
        count: 17,
      },
    ],
  },
  {
    title: "Bath & Body",
    options: [
      { value: "hand-cream", label: "Hand Creams", param: "type", count: 20 },
      { value: "foot-cream", label: "Foot Creams", param: "type", count: 8 },
      { value: "body-butter", label: "Body Butter", param: "type", count: 13 },
      { value: "body-mist", label: "Body Mist / Spray", param: "type", count: 16 },
      { value: "deodorant", label: "Deodorants / Roll-Ons", param: "type", count: 21 },
      { value: "body-lotion", label: "Lotions & Creams", param: "type", count: 27 },
      { value: "body-scrub", label: "Body Scrubs", param: "type", count: 10 },
      {
        value: "anti-stretch-mark",
        label: "Anti-Stretch Mark Creams",
        param: "type",
        count: 7,
      },
    ],
  },
  {
    title: "Eye Care & Sun Care",
    options: [
      { value: "eye-cream", label: "Eye Cream / Eye Gel", param: "type", count: 19 },
      { value: "eye-roller", label: "Eye Roller", param: "type", count: 6 },
      {
        value: "dark-circles",
        label: "Under Eye / Dark Circles",
        param: "type",
        count: 11,
      },
      { value: "sun-care", label: "Sun Care", param: "type", count: 24 },
      {
        value: "eye-makeup-remover",
        label: "Eye Makeup Remover",
        param: "type",
        count: 9,
      },
    ],
  },
  {
    title: "Shop by Concern",
    options: [
      {
        value: "skin-lightening",
        label: "Skin Lightening",
        param: "concern",
        count: 25,
      },
      {
        value: "sun-protection",
        label: "Sun Protection",
        param: "concern",
        count: 30,
      },
      { value: "tan-removal", label: "Tan Removal", param: "concern", count: 14 },
      { value: "pigmentation", label: "Pigmentation", param: "concern", count: 18 },
      { value: "acne", label: "Acne Treatment", param: "concern", count: 29 },
      { value: "anti-aging", label: "Anti Aging", param: "concern", count: 22 },
      { value: "oil-control", label: "Oil Control", param: "concern", count: 16 },
      {
        value: "cold-protection",
        label: "Cold Protection",
        param: "concern",
        count: 8,
      },
      {
        value: "dull-skin",
        label: "Dull Skin Treatment",
        param: "concern",
        count: 13,
      },
      { value: "pore-care", label: "Pore Care", param: "concern", count: 15 },
      { value: "dry-skin", label: "Dry Skin Remedy", param: "concern", count: 20 },
    ],
  },
];

export const haircareCategoryGroups: CategoryGroup[] = [
  {
    title: "Hair Care",
    options: [
      { value: "shampoo", label: "Shampoo", param: "type", count: 48 },
      { value: "conditioner", label: "Conditioner", param: "type", count: 36 },
      { value: "hair-oil", label: "Hair Oil", param: "type", count: 29 },
      {
        value: "hair-cream-masks",
        label: "Hair Cream & Masks",
        param: "type",
        count: 22,
      },
      { value: "hair-serum", label: "Hair Serum", param: "type", count: 18 },
      { value: "rebonding-kit", label: "Rebonding Kit", param: "type", count: 7 },
      { value: "value-pack", label: "Value Pack", param: "type", count: 12 },
    ],
  },
  {
    title: "Hair Styling",
    options: [
      { value: "hair-color", label: "Hair Color", param: "type", count: 21 },
      { value: "hair-spray", label: "Hair Spray", param: "type", count: 15 },
      { value: "gels-waxes", label: "Gels & Waxes", param: "type", count: 14 },
      { value: "hair-primer", label: "Hair Primer", param: "type", count: 9 },
    ],
  },
  {
    title: "Tools & Accessories",
    options: [
      { value: "hair-combs", label: "Hair Combs", param: "type", count: 17 },
      {
        value: "hair-straightener",
        label: "Hair Straightener",
        param: "type",
        count: 8,
      },
      { value: "hair-dryer", label: "Hair Dryer", param: "type", count: 6 },
      { value: "hair-band", label: "Hair Band", param: "type", count: 24 },
    ],
  },
  {
    title: "Shop by Hair Type & Concern",
    options: [
      { value: "straight", label: "Straight", param: "type", count: 19 },
      { value: "curly-wavy", label: "Curly & Wavy", param: "type", count: 23 },
      {
        value: "hairfall-thinning",
        label: "Hairfall & Thinning",
        param: "concern",
        count: 31,
      },
      { value: "dandruff", label: "Dandruff", param: "concern", count: 20 },
      {
        value: "dry-frizzy",
        label: "Dry & Frizzy Hair",
        param: "concern",
        count: 26,
      },
      { value: "split-ends", label: "Split Ends", param: "concern", count: 14 },
      {
        value: "color-protection",
        label: "Color Protection",
        param: "concern",
        count: 11,
      },
    ],
  },
];

export const makeupCategoryGroups: CategoryGroup[] = [
  {
    title: "Face",
    options: [
      { value: "primers", label: "Primers", param: "type", count: 18 },
      {
        value: "color-correctors",
        label: "Color Correctors",
        param: "type",
        count: 12,
      },
      { value: "foundations", label: "Foundations", param: "type", count: 34 },
      { value: "bb-cc-creams", label: "BB & CC Creams", param: "type", count: 16 },
      { value: "concealers", label: "Concealers", param: "type", count: 22 },
      {
        value: "setting-powders",
        label: "Setting Powders",
        param: "type",
        count: 14,
      },
      {
        value: "setting-sprays",
        label: "Setting Sprays",
        param: "type",
        count: 11,
      },
      { value: "blush", label: "Blush", param: "type", count: 27 },
      { value: "bronzers", label: "Bronzers", param: "type", count: 13 },
      { value: "highlighters", label: "Highlighters", param: "type", count: 19 },
      { value: "contour", label: "Contour", param: "type", count: 10 },
    ],
  },
  {
    title: "Eyes",
    options: [
      { value: "eyeliner", label: "Eyeliner", param: "type", count: 25 },
      { value: "mascara", label: "Mascara", param: "type", count: 21 },
      {
        value: "lash-primers-serums",
        label: "Lash Primers & Serums",
        param: "type",
        count: 9,
      },
      { value: "eyeshadow", label: "Eyeshadow", param: "type", count: 30 },
      {
        value: "glitter-pigments",
        label: "Glitter & Pigments",
        param: "type",
        count: 8,
      },
      { value: "eyebrows", label: "Eyebrows", param: "type", count: 17 },
      { value: "eye-primers", label: "Eye Primers", param: "type", count: 7 },
      {
        value: "false-lashes-glue",
        label: "False Lashes & Glue",
        param: "type",
        count: 12,
      },
    ],
  },
  {
    title: "Lips",
    options: [
      { value: "lipstick", label: "Lipstick", param: "type", count: 41 },
      { value: "lip-gloss", label: "Lip Gloss", param: "type", count: 23 },
      { value: "lip-liner", label: "Lip Liner", param: "type", count: 15 },
      { value: "lip-plumpers", label: "Lip Plumpers", param: "type", count: 6 },
      {
        value: "lip-balms-tints",
        label: "Lip Balms & Tints",
        param: "type",
        count: 20,
      },
      {
        value: "lip-primers-scrubs",
        label: "Lip Primers & Scrubs",
        param: "type",
        count: 8,
      },
      {
        value: "lip-masks-oils",
        label: "Lip Masks & Oils",
        param: "type",
        count: 11,
      },
    ],
  },
  {
    title: "Beauty Accessories",
    options: [
      { value: "brush-sets", label: "Brush Sets", param: "type", count: 14 },
      { value: "face-brushes", label: "Face Brushes", param: "type", count: 18 },
      { value: "eye-brushes", label: "Eye Brushes", param: "type", count: 16 },
      {
        value: "sponges-blenders",
        label: "Makeup Sponges & Blenders",
        param: "type",
        count: 13,
      },
      { value: "powder-puffs", label: "Powder Puffs", param: "type", count: 9 },
      {
        value: "eyelash-curlers",
        label: "Eyelash Curlers",
        param: "type",
        count: 7,
      },
      {
        value: "tweezers-sharpeners",
        label: "Tweezers & Pencil Sharpeners",
        param: "type",
        count: 10,
      },
    ],
  },
];

const priceFilters = [
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50 to $100" },
  { value: "100-150", label: "$100 to $150" },
  { value: "150-200", label: "$150 to $200" },
  { value: "over-200", label: "Over $200" },
];

function toSelectValue(option: CategoryOption) {
  return `${option.param}:${option.value}`;
}

export default function Category({
  groups = skincareCategoryGroups,
  basePath = "/skincare",
  defaultOpen,
}: {
  groups?: CategoryGroup[];
  basePath?: string;
  defaultOpen?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const concern = searchParams.get("concern");
  const selected = type
    ? `type:${type}`
    : concern
      ? `concern:${concern}`
      : "";
  const selectedPrices = new Set(
    (searchParams.get("price") ?? "").split(",").filter(Boolean),
  );

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [defaultOpen ?? groups[0]?.title ?? ""]: true,
    Filters: true,
  });

  const toggleSection = (title: string) => {
    setOpenSections((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  const selectCategory = (rawValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("concern");
    params.delete("page");

    if (rawValue) {
      const [param, value] = rawValue.split(":");
      if (param === "type" || param === "concern") {
        params.set(param, value);
      }
    }

    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  const togglePrice = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const next = new Set(selectedPrices);

    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }

    params.delete("page");

    if (next.size) {
      params.set("price", Array.from(next).join(","));
    } else {
      params.delete("price");
    }

    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  return (
    <aside className="w-full lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:max-w-[16rem] lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
      <button
        type="button"
        onClick={() => setMobileFiltersOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-primary bg-background px-4 py-3 text-left lg:hidden"
        aria-expanded={mobileFiltersOpen}
      >
        <span className="text-[12px] font-bold tracking-[0.12em] text-foreground uppercase">
          Categories & Filters
        </span>
        <HiOutlineChevronDown
          className={`h-4 w-4 text-foreground/50 transition-transform ${
            mobileFiltersOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`mt-4 flex flex-col gap-8 lg:mt-0 ${
          mobileFiltersOpen ? "flex" : "hidden lg:flex"
        }`}
      >
        {groups.map((group) => {
          const isOpen = Boolean(openSections[group.title]);

          return (
            <div key={group.title}>
              <button
                type="button"
                onClick={() => toggleSection(group.title)}
                className="flex w-full items-center justify-between gap-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-[12px] font-bold tracking-[0.12em] text-foreground uppercase">
                  {group.title}
                </span>
                <HiOutlineChevronDown
                  className={`h-4 w-4 text-foreground/50 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen ? (
                <ul className="mt-4">
                  {group.options.map((option) => {
                    const value = toSelectValue(option);
                    const isActive = selected === value;

                    return (
                      <li key={value} className="border-b border-foreground/10">
                        <button
                          type="button"
                          onClick={() =>
                            selectCategory(isActive ? "" : value)
                          }
                          className={`flex w-full items-center justify-between gap-3 py-3 text-left text-[13px] transition-colors ${
                            isActive
                              ? "text-accent"
                              : "text-foreground/70 hover:text-foreground"
                          }`}
                        >
                          <span className="pr-2">{option.label}</span>
                          <span className="shrink-0 text-foreground/50">
                            {option.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}

        <div>
          <button
            type="button"
            onClick={() => toggleSection("Filters")}
            className="flex w-full items-center justify-between gap-3 text-left"
            aria-expanded={Boolean(openSections.Filters)}
          >
            <span className="text-[12px] font-bold tracking-[0.12em] text-foreground uppercase">
              Filters
            </span>
            <HiOutlineChevronDown
              className={`h-4 w-4 text-foreground/50 transition-transform ${
                openSections.Filters ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSections.Filters ? (
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-4">
              {priceFilters.map((filter) => {
                const checked = selectedPrices.has(filter.value);

                return (
                  <li key={filter.value}>
                    <label className="flex cursor-pointer items-center gap-2 text-[12px] text-foreground/70 transition-colors hover:text-foreground sm:text-[13px]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePrice(filter.value)}
                        className="h-4 w-4 shrink-0 appearance-none rounded border border-foreground/20 checked:border-accent checked:bg-accent"
                      />
                      <span>{filter.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
