"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";

export type CategoryOption = {
  value: string;
  label: string;
  param: "type" | "concern";
};

export type CategoryGroup = {
  title: string;
  options: CategoryOption[];
};

export const skincareCategoryGroups: CategoryGroup[] = [
  {
    title: "Face",
    options: [
      { value: "cleanser", label: "Cleanser / Facewash", param: "type" },
      {
        value: "day-night-cream",
        label: "Day Cream / Night Cream",
        param: "type",
      },
      { value: "masks-peels", label: "Masks & Peels", param: "type" },
      { value: "sheet-mask", label: "Sheet Mask", param: "type" },
      {
        value: "scrubs-exfoliators",
        label: "Scrubs & Exfoliators",
        param: "type",
      },
      {
        value: "toners-astringents",
        label: "Toners & Astringents",
        param: "type",
      },
      { value: "facial-wipes", label: "Facial Wipes / Kit", param: "type" },
      {
        value: "serum-oils",
        label: "Serum / Oils",
        param: "type",
      },
      {
        value: "moisturizers",
        label: "Moisturizers",
        param: "type",
      },
      { value: "spot-remover", label: "Spot Remover", param: "type" },
      { value: "lip-care", label: "Lip Balms / Lip Care", param: "type" },
    ],
  },
  {
    title: "K-Beauty",
    options: [
      { value: "sunscreen", label: "Sunscreen", param: "type" },
      { value: "essence", label: "Essence", param: "type" },
      { value: "ampoule", label: "Ampoule", param: "type" },
      { value: "cleansing-oil", label: "Cleansing Oil", param: "type" },
      { value: "sleeping-mask", label: "Sleeping Mask", param: "type" },
      {
        value: "eye-patch",
        label: "Eye Cream / Gel / Patch",
        param: "type",
      },
    ],
  },
  {
    title: "Bath & Body",
    options: [
      { value: "hand-cream", label: "Hand Creams", param: "type" },
      { value: "foot-cream", label: "Foot Creams", param: "type" },
      { value: "body-butter", label: "Body Butter", param: "type" },
      { value: "body-mist", label: "Body Mist / Spray", param: "type" },
      { value: "deodorant", label: "Deodorants / Roll-Ons", param: "type" },
      { value: "body-lotion", label: "Lotions & Creams", param: "type" },
      { value: "body-scrub", label: "Body Scrubs", param: "type" },
      {
        value: "anti-stretch-mark",
        label: "Anti-Stretch Mark Creams",
        param: "type",
      },
    ],
  },
  {
    title: "Eye Care & Sun Care",
    options: [
      { value: "eye-cream", label: "Eye Cream / Eye Gel", param: "type" },
      { value: "eye-roller", label: "Eye Roller", param: "type" },
      {
        value: "dark-circles",
        label: "Under Eye / Dark Circles",
        param: "type",
      },
      { value: "sun-care", label: "Sun Care", param: "type" },
      {
        value: "eye-makeup-remover",
        label: "Eye Makeup Remover",
        param: "type",
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
      },
      {
        value: "sun-protection",
        label: "Sun Protection",
        param: "concern",
      },
      { value: "tan-removal", label: "Tan Removal", param: "concern" },
      { value: "pigmentation", label: "Pigmentation", param: "concern" },
      { value: "acne", label: "Acne Treatment", param: "concern" },
      { value: "anti-aging", label: "Anti Aging", param: "concern" },
      { value: "oil-control", label: "Oil Control", param: "concern" },
      {
        value: "cold-protection",
        label: "Cold Protection",
        param: "concern",
      },
      {
        value: "dull-skin",
        label: "Dull Skin Treatment",
        param: "concern",
      },
      { value: "pore-care", label: "Pore Care", param: "concern" },
      { value: "dry-skin", label: "Dry Skin Remedy", param: "concern" },
    ],
  },
];

export const haircareCategoryGroups: CategoryGroup[] = [
  {
    title: "Hair Care",
    options: [
      { value: "shampoo", label: "Shampoo", param: "type" },
      { value: "conditioner", label: "Conditioner", param: "type" },
      { value: "hair-oil", label: "Hair Oil", param: "type" },
      {
        value: "hair-cream-masks",
        label: "Hair Cream & Masks",
        param: "type",
      },
      { value: "hair-serum", label: "Hair Serum", param: "type" },
      { value: "rebonding-kit", label: "Rebonding Kit", param: "type" },
      { value: "value-pack", label: "Value Pack", param: "type" },
    ],
  },
  {
    title: "Hair Styling",
    options: [
      { value: "hair-color", label: "Hair Color", param: "type" },
      { value: "hair-spray", label: "Hair Spray", param: "type" },
      { value: "gels-waxes", label: "Gels & Waxes", param: "type" },
      { value: "hair-primer", label: "Hair Primer", param: "type" },
    ],
  },
  {
    title: "Tools & Accessories",
    options: [
      { value: "hair-combs", label: "Hair Combs", param: "type" },
      {
        value: "hair-straightener",
        label: "Hair Straightener",
        param: "type",
      },
      { value: "hair-dryer", label: "Hair Dryer", param: "type" },
      { value: "hair-band", label: "Hair Band", param: "type" },
    ],
  },
  {
    title: "Shop by Hair Type & Concern",
    options: [
      { value: "straight", label: "Straight", param: "type" },
      { value: "curly-wavy", label: "Curly & Wavy", param: "type" },
      {
        value: "hairfall-thinning",
        label: "Hairfall & Thinning",
        param: "concern",
      },
      { value: "dandruff", label: "Dandruff", param: "concern" },
      {
        value: "dry-frizzy",
        label: "Dry & Frizzy Hair",
        param: "concern",
      },
      { value: "split-ends", label: "Split Ends", param: "concern" },
      {
        value: "color-protection",
        label: "Color Protection",
        param: "concern",
      },
    ],
  },
];

export const makeupCategoryGroups: CategoryGroup[] = [
  {
    title: "Face",
    options: [
      { value: "primers", label: "Primers", param: "type" },
      {
        value: "color-correctors",
        label: "Color Correctors",
        param: "type",
      },
      { value: "foundations", label: "Foundations", param: "type" },
      { value: "bb-cc-creams", label: "BB & CC Creams", param: "type" },
      { value: "concealers", label: "Concealers", param: "type" },
      {
        value: "setting-powders",
        label: "Setting Powders",
        param: "type",
      },
      {
        value: "setting-sprays",
        label: "Setting Sprays",
        param: "type",
      },
      { value: "blush", label: "Blush", param: "type" },
      { value: "bronzers", label: "Bronzers", param: "type" },
      { value: "highlighters", label: "Highlighters", param: "type" },
      { value: "contour", label: "Contour", param: "type" },
    ],
  },
  {
    title: "Eyes",
    options: [
      { value: "eyeliner", label: "Eyeliner", param: "type" },
      { value: "mascara", label: "Mascara", param: "type" },
      {
        value: "lash-primers-serums",
        label: "Lash Primers & Serums",
        param: "type",
      },
      { value: "eyeshadow", label: "Eyeshadow", param: "type" },
      {
        value: "glitter-pigments",
        label: "Glitter & Pigments",
        param: "type",
      },
      { value: "eyebrows", label: "Eyebrows", param: "type" },
      { value: "eye-primers", label: "Eye Primers", param: "type" },
      {
        value: "false-lashes-glue",
        label: "False Lashes & Glue",
        param: "type",
      },
    ],
  },
  {
    title: "Lips",
    options: [
      { value: "lipstick", label: "Lipstick", param: "type" },
      { value: "lip-gloss", label: "Lip Gloss", param: "type" },
      { value: "lip-liner", label: "Lip Liner", param: "type" },
      { value: "lip-plumpers", label: "Lip Plumpers", param: "type" },
      {
        value: "lip-balms-tints",
        label: "Lip Balms & Tints",
        param: "type",
      },
      {
        value: "lip-primers-scrubs",
        label: "Lip Primers & Scrubs",
        param: "type",
      },
      {
        value: "lip-masks-oils",
        label: "Lip Masks & Oils",
        param: "type",
      },
    ],
  },
  {
    title: "Beauty Accessories",
    options: [
      { value: "brush-sets", label: "Brush Sets", param: "type" },
      { value: "face-brushes", label: "Face Brushes", param: "type" },
      { value: "eye-brushes", label: "Eye Brushes", param: "type" },
      {
        value: "sponges-blenders",
        label: "Makeup Sponges & Blenders",
        param: "type",
      },
      { value: "powder-puffs", label: "Powder Puffs", param: "type" },
      {
        value: "eyelash-curlers",
        label: "Eyelash Curlers",
        param: "type",
      },
      {
        value: "tweezers-sharpeners",
        label: "Tweezers & Pencil Sharpeners",
        param: "type",
      },
    ],
  },
];

const priceFilters = [
  { value: "under-500", label: "Under ৳500" },
  { value: "500-1000", label: "৳500 to ৳1000" },
  { value: "1000-1500", label: "৳1000 to ৳1500" },
  { value: "1500-2000", label: "৳1500 to ৳2000" },
  { value: "2000-3000", label: "৳2000 to ৳3000" },
  { value: "over-3000", label: "Over ৳3000" },
];

function toSelectValue(option: CategoryOption) {
  return `${option.param}:${option.value}`;
}

export default function Category({
  groups = skincareCategoryGroups,
  counts,
  basePath = "/skincare",
  defaultOpen,
}: {
  groups?: CategoryGroup[];
  counts: Record<string, number>;
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
                            {counts[`${option.param}:${option.value}`] ?? 0}
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
