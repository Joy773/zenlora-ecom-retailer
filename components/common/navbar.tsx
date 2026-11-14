"use client";

import { Montserrat } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineBars3,
  HiOutlineChevronDown,
  HiOutlineShoppingBag,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useCart } from "@/context/cart-context";
import { ShopNowButton } from "./button";

const montserrat = Montserrat({
  weight: ["700", "800"],
  subsets: ["latin"],
});

type NavLink = {
  href?: string;
  label: string;
  children?: { title: string; items: { href: string; label: string }[] }[];
};

function normalizeShopHref(href: string) {
  const [path, query = ""] = href.split("?");
  if (path !== "/shop") return href;

  const params = new URLSearchParams(query);
  const category = params.get("category");
  const destination =
    category === "makeup"
      ? "/makeup"
      : category === "haircare"
        ? "/haircare"
        : "/skincare";

  params.delete("category");
  if (params.get("sort") === "best-sellers") {
    params.delete("sort");
    params.set("flag", "best-selling");
  }

  const queryString = params.toString();
  return queryString ? `${destination}?${queryString}` : destination;
}

const skincareMenu: NonNullable<NavLink["children"]> = [
  {
    title: "Face",
    items: [
      { href: "/shop?category=skincare&type=cleanser", label: "Cleanser / Facewash" },
      {
        href: "/shop?category=skincare&type=day-night-cream",
        label: "Day Cream / Night Cream",
      },
      { href: "/shop?category=skincare&type=masks-peels", label: "Masks & Peels" },
      { href: "/shop?category=skincare&type=sheet-mask", label: "Sheet Mask" },
      {
        href: "/shop?category=skincare&type=scrubs-exfoliators",
        label: "Scrubs & Exfoliators",
      },
      {
        href: "/shop?category=skincare&type=toners-astringents",
        label: "Toners & Astringents",
      },
      { href: "/shop?category=skincare&type=facial-wipes", label: "Facial Wipes / Kit" },
      {
        href: "/shop?category=skincare&type=serum-oils",
        label: "Serum / Oils",
      },
      {
        href: "/shop?category=skincare&type=moisturizers",
        label: "Moisturizers",
      },
      { href: "/shop?category=skincare&type=spot-remover", label: "Spot Remover" },
      { href: "/shop?category=skincare&type=lip-care", label: "Lip Balms / Lip Care" },
    ],
  },
  {
    title: "K-Beauty",
    items: [
      { href: "/shop?category=skincare&type=sunscreen", label: "Sunscreen" },
      { href: "/shop?category=skincare&type=essence", label: "Essence" },
      { href: "/shop?category=skincare&type=ampoule", label: "Ampoule" },
      { href: "/shop?category=skincare&type=cleansing-oil", label: "Cleansing Oil" },
      { href: "/shop?category=skincare&type=sleeping-mask", label: "Sleeping Mask" },
      { href: "/shop?category=skincare&type=eye-patch", label: "Eye Cream / Gel / Patch" },
    ],
  },
  {
    title: "Bath & Body",
    items: [
      { href: "/shop?category=skincare&type=hand-cream", label: "Hand Creams" },
      { href: "/shop?category=skincare&type=foot-cream", label: "Foot Creams" },
      { href: "/shop?category=skincare&type=body-butter", label: "Body Butter" },
      { href: "/shop?category=skincare&type=body-mist", label: "Body Mist / Spray" },
      { href: "/shop?category=skincare&type=deodorant", label: "Deodorants / Roll-Ons" },
      { href: "/shop?category=skincare&type=body-lotion", label: "Lotions & Creams" },
      { href: "/shop?category=skincare&type=body-scrub", label: "Body Scrubs" },
      {
        href: "/shop?category=skincare&type=anti-stretch-mark",
        label: "Anti-Stretch Mark Creams",
      },
    ],
  },
  {
    title: "Eye Care & Sun Care",
    items: [
      { href: "/shop?category=skincare&type=eye-cream", label: "Eye Cream / Eye Gel" },
      { href: "/shop?category=skincare&type=eye-roller", label: "Eye Roller" },
      {
        href: "/shop?category=skincare&type=dark-circles",
        label: "Under Eye / Dark Circles",
      },
      { href: "/shop?category=skincare&type=sun-care", label: "Sun Care" },
      {
        href: "/shop?category=skincare&type=eye-makeup-remover",
        label: "Eye Makeup Remover",
      },
    ],
  },
  {
    title: "Shop by Concern",
    items: [
      {
        href: "/shop?category=skincare&concern=skin-lightening",
        label: "Skin Lightening",
      },
      {
        href: "/shop?category=skincare&concern=sun-protection",
        label: "Sun Protection",
      },
      { href: "/shop?category=skincare&concern=tan-removal", label: "Tan Removal" },
      { href: "/shop?category=skincare&concern=pigmentation", label: "Pigmentation" },
      { href: "/shop?category=skincare&concern=acne", label: "Acne Treatment" },
      { href: "/shop?category=skincare&concern=anti-aging", label: "Anti Aging" },
      { href: "/shop?category=skincare&concern=oil-control", label: "Oil Control" },
      {
        href: "/shop?category=skincare&concern=cold-protection",
        label: "Cold Protection",
      },
      { href: "/shop?category=skincare&concern=dull-skin", label: "Dull Skin Treatment" },
      { href: "/shop?category=skincare&concern=pore-care", label: "Pore Care" },
      { href: "/shop?category=skincare&concern=dry-skin", label: "Dry Skin Remedy" },
    ],
  },
];

const makeupMenu: NonNullable<NavLink["children"]> = [
  {
    title: "Face",
    items: [
      { href: "/makeup?type=primers", label: "Primers" },
      {
        href: "/makeup?type=color-correctors",
        label: "Color Correctors",
      },
      { href: "/makeup?type=foundations", label: "Foundations" },
      { href: "/makeup?type=bb-cc-creams", label: "BB & CC Creams" },
      { href: "/makeup?type=concealers", label: "Concealers" },
      {
        href: "/makeup?type=setting-powders",
        label: "Setting Powders",
      },
      { href: "/makeup?type=setting-sprays", label: "Setting Sprays" },
      { href: "/makeup?type=blush", label: "Blush" },
      { href: "/makeup?type=bronzers", label: "Bronzers" },
      { href: "/makeup?type=highlighters", label: "Highlighters" },
      { href: "/makeup?type=contour", label: "Contour" },
    ],
  },
  {
    title: "Eyes",
    items: [
      { href: "/makeup?type=eyeliner", label: "Eyeliner" },
      { href: "/makeup?type=mascara", label: "Mascara" },
      {
        href: "/makeup?type=lash-primers-serums",
        label: "Lash Primers & Serums",
      },
      { href: "/makeup?type=eyeshadow", label: "Eyeshadow" },
      {
        href: "/makeup?type=glitter-pigments",
        label: "Glitter & Pigments",
      },
      { href: "/makeup?type=eyebrows", label: "Eyebrows" },
      { href: "/makeup?type=eye-primers", label: "Eye Primers" },
      {
        href: "/makeup?type=false-lashes-glue",
        label: "False Lashes & Glue",
      },
    ],
  },
  {
    title: "Lips",
    items: [
      { href: "/makeup?type=lipstick", label: "Lipstick" },
      { href: "/makeup?type=lip-gloss", label: "Lip Gloss" },
      { href: "/makeup?type=lip-liner", label: "Lip Liner" },
      { href: "/makeup?type=lip-plumpers", label: "Lip Plumpers" },
      {
        href: "/makeup?type=lip-balms-tints",
        label: "Lip Balms & Tints",
      },
      {
        href: "/makeup?type=lip-primers-scrubs",
        label: "Lip Primers & Scrubs",
      },
      {
        href: "/makeup?type=lip-masks-oils",
        label: "Lip Masks & Oils",
      },
    ],
  },
  {
    title: "Beauty Accessories",
    items: [
      {
        href: "/makeup?type=brush-sets",
        label: "Brush Sets",
      },
      {
        href: "/makeup?type=face-brushes",
        label: "Face Brushes",
      },
      {
        href: "/makeup?type=eye-brushes",
        label: "Eye Brushes",
      },
      {
        href: "/makeup?type=sponges-blenders",
        label: "Makeup Sponges & Blenders",
      },
      {
        href: "/makeup?type=powder-puffs",
        label: "Powder Puffs",
      },
      {
        href: "/makeup?type=eyelash-curlers",
        label: "Eyelash Curlers",
      },
      {
        href: "/makeup?type=tweezers-sharpeners",
        label: "Tweezers & Pencil Sharpeners",
      },
    ],
  },
];

const haircareMenu: NonNullable<NavLink["children"]> = [
  {
    title: "Hair Care",
    items: [
      { href: "/haircare?type=shampoo", label: "Shampoo" },
      { href: "/haircare?type=conditioner", label: "Conditioner" },
      { href: "/haircare?type=hair-oil", label: "Hair Oil" },
      {
        href: "/haircare?type=hair-cream-masks",
        label: "Hair Cream & Masks",
      },
      { href: "/haircare?type=hair-serum", label: "Hair Serum" },
      {
        href: "/haircare?type=rebonding-kit",
        label: "Rebonding Kit",
      },
      { href: "/haircare?type=value-pack", label: "Value Pack" },
    ],
  },
  {
    title: "Hair Styling",
    items: [
      { href: "/haircare?type=hair-color", label: "Hair Color" },
      { href: "/haircare?type=hair-spray", label: "Hair Spray" },
      { href: "/haircare?type=gels-waxes", label: "Gels & Waxes" },
      { href: "/haircare?type=hair-primer", label: "Hair Primer" },
    ],
  },
  {
    title: "Tools & Accessories",
    items: [
      { href: "/haircare?type=hair-combs", label: "Hair Combs" },
      {
        href: "/haircare?type=hair-straightener",
        label: "Hair Straightener",
      },
      { href: "/haircare?type=hair-dryer", label: "Hair Dryer" },
      { href: "/haircare?type=hair-band", label: "Hair Band" },
    ],
  },
  {
    title: "Shop by Hair Type & Concern",
    items: [
      {
        href: "/haircare?type=straight",
        label: "Straight",
      },
      {
        href: "/haircare?type=curly-wavy",
        label: "Curly & Wavy",
      },
      {
        href: "/haircare?concern=hairfall-thinning",
        label: "Hairfall & Thinning",
      },
      { href: "/haircare?concern=dandruff", label: "Dandruff" },
      {
        href: "/haircare?concern=dry-frizzy",
        label: "Dry & Frizzy Hair",
      },
      {
        href: "/haircare?concern=split-ends",
        label: "Split Ends",
      },
      {
        href: "/haircare?concern=color-protection",
        label: "Color Protection",
      },
    ],
  },
];

const bestSellersMenu: NonNullable<NavLink["children"]> = [
  {
    title: "Categories",
    items: [
      { href: "/makeup?flag=best-selling", label: "Makeup" },
      { href: "/skincare?flag=best-selling", label: "Skincare" },
      { href: "/haircare?flag=best-selling", label: "Haircare" },
    ],
  },
];

const newArrivalsMenu: NonNullable<NavLink["children"]> = [
  {
    title: "Categories",
    items: [
      { href: "/makeup?flag=new", label: "Makeup" },
      { href: "/skincare?flag=new", label: "Skincare" },
      { href: "/haircare?flag=new", label: "Haircare" },
    ],
  },
];

const offersMenu: NonNullable<NavLink["children"]> = [
  {
    title: "Categories",
    items: [
      { href: "/makeup?flag=offer", label: "Makeup" },
      { href: "/skincare?flag=offer", label: "Skincare" },
      { href: "/haircare?flag=offer", label: "Haircare" },
    ],
  },
];

const links: NavLink[] = [
  { href: "/", label: "Home" },
  {
    href: "/haircare",
    label: "Haircare",
    children: haircareMenu,
  },
  {
    label: "Best Sellers",
    children: bestSellersMenu,
  },
  {
    href: "/skincare",
    label: "Skincare",
    children: skincareMenu,
  },
  {
    href: "/makeup",
    label: "Makeup",
    children: makeupMenu,
  },
  {
    label: "New Arrivals",
    children: newArrivalsMenu,
  },
  {
    label: "Offers",
    children: offersMenu,
  },
];

function CartIcon({ onClick }: { onClick?: () => void }) {
  const { itemCount, isHydrated } = useCart();
  const showCount = isHydrated && itemCount > 0;

  return (
    <Link
      href="/cart"
      onClick={onClick}
      aria-label={
        showCount ? `Shopping cart, ${itemCount} items` : "Shopping cart"
      }
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-foreground transition-all duration-200 hover:border-primary hover:bg-primary/50 hover:text-accent"
    >
      <HiOutlineShoppingBag className="h-6 w-6 stroke-[1.4] transition-transform duration-200 group-hover:scale-105" />
      {showCount ? (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const closeMenu = () => {
    setOpen(false);
    setExpandedMobile(null);
  };

  return (
    <header className="relative z-40 border-b border-primary bg-white">
      <nav className="flex items-center justify-between gap-4 px-8 py-4 md:px-16 lg:px-20">
        <Link
          href="/"
          onClick={closeMenu}
          className={`${montserrat.className} shrink-0 text-xl font-bold uppercase leading-none tracking-[0.25em] text-foreground md:text-2xl`}
        >
          ZenLora
        </Link>

        <ul className="hidden flex-1 flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs tracking-wide lg:flex lg:gap-x-9 lg:text-sm">
          {links.map((link) => (
            <li key={link.label} className="relative group">
              {link.href ? (
                <Link
                  href={normalizeShopHref(link.href)}
                  className="whitespace-nowrap font-bold text-foreground/80 transition-colors hover:text-accent group-hover:text-accent"
                >
                  {link.label}
                </Link>
              ) : (
                <span className="cursor-default whitespace-nowrap font-bold text-foreground/80 transition-colors group-hover:text-accent">
                  {link.label}
                </span>
              )}

              {link.children ? (
                <div className="invisible absolute top-full left-1/2 z-50 w-max max-w-[90vw] -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-xl border border-primary bg-white p-6 shadow-lg">
                    <div
                      className="grid gap-x-10 gap-y-6"
                      style={{
                        gridTemplateColumns: `repeat(${link.children.length}, max-content)`,
                      }}
                    >
                      {link.children.map((group) => (
                        <div key={group.title}>
                          <p className="text-[11px] font-bold tracking-[0.15em] text-accent uppercase">
                            {group.title}
                          </p>
                          <ul className="mt-3 flex flex-col gap-2">
                            {group.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={normalizeShopHref(item.href)}
                                  className="text-[12px] leading-snug text-foreground/70 transition-colors hover:text-accent"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <CartIcon />
          <ShopNowButton />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <CartIcon onClick={closeMenu} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary/60"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <HiOutlineXMark className="h-7 w-7" />
            ) : (
              <HiOutlineBars3 className="h-7 w-7" />
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="max-h-[75vh] overflow-y-auto border-t border-primary px-8 py-5 md:px-16 lg:hidden"
        >
          <ul className="flex flex-col gap-4 text-sm tracking-wide">
            {links.map((link) => {
              const isExpanded = expandedMobile === link.label;

              return (
                <li key={link.label}>
                  {link.children ? (
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        {link.href ? (
                          <Link
                            href={normalizeShopHref(link.href)}
                            onClick={closeMenu}
                            className="font-bold text-foreground/80 transition-colors hover:text-accent"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedMobile(isExpanded ? null : link.label)
                            }
                            className="font-bold text-foreground/80 transition-colors hover:text-accent"
                            aria-expanded={isExpanded}
                          >
                            {link.label}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMobile(isExpanded ? null : link.label)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary/60"
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? "Hide" : "Show"} ${link.label} options`}
                        >
                          <HiOutlineChevronDown
                            className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>

                      {isExpanded ? (
                        <div className="mt-3 space-y-4 border-l border-primary pl-4">
                          {link.children.map((group) => (
                            <div key={group.title}>
                              <p className="text-[11px] font-bold tracking-[0.15em] text-accent uppercase">
                                {group.title}
                              </p>
                              <ul className="mt-2 flex flex-col gap-2">
                                {group.items.map((item) => (
                                  <li key={item.href}>
                                    <Link
                            href={normalizeShopHref(item.href)}
                                      onClick={closeMenu}
                                      className="block text-[13px] text-foreground/70 transition-colors hover:text-accent"
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : link.href ? (
                    <Link
                      href={normalizeShopHref(link.href)}
                      onClick={closeMenu}
                      className="block font-bold text-foreground/80 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="block font-bold text-foreground/80">
                      {link.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="pt-5">
            <ShopNowButton />
          </div>
        </div>
      ) : null}
    </header>
  );
}
