"use client";

import { Lavishly_Yours } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineBars3,
  HiOutlineShoppingBag,
  HiOutlineXMark,
} from "react-icons/hi2";
import { ShopNowButton } from "./button";

const lavishlyYours = Lavishly_Yours({
  weight: "400",
  subsets: ["latin"],
});

const links = [
  { href: "/", label: "Home" },
  { href: "/shop?category=haircare", label: "Haircare" },
  { href: "/shop?category=beauty-accessories", label: "Beauty Accessories" },
  { href: "/brands", label: "Brands" },
  { href: "/shop?sort=best-sellers", label: "Best Sellers" },
  { href: "/shop?category=skincare", label: "Skincare" },
  { href: "/shop?category=makeup", label: "Makeup" },
  { href: "/shop?category=bath-body", label: "Bath & Body" },
  { href: "/shop?sort=new", label: "New Arrivals" },
  { href: "/offers", label: "Offers" },
];

function CartIcon({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/cart"
      onClick={onClick}
      aria-label="Shopping cart"
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-foreground transition-all duration-200 hover:border-primary hover:bg-primary/50 hover:text-accent"
    >
      <HiOutlineShoppingBag className="h-6 w-6 stroke-[1.4] transition-transform duration-200 group-hover:scale-105" />
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="border-b border-primary bg-background">
      <nav className="flex items-center justify-between gap-4 px-8 py-4 md:px-16 lg:px-20">
        <Link
          href="/"
          onClick={closeMenu}
          className={`${lavishlyYours.className} shrink-0 text-3xl font-bold leading-none text-foreground [-webkit-text-stroke:0.6px_currentColor] md:text-5xl`}
        >
          ZenLora
        </Link>

        <ul className="hidden flex-1 flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs tracking-wide lg:flex lg:gap-x-9 lg:text-sm">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="whitespace-nowrap font-bold text-foreground/80 transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
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
          className="border-t border-primary px-8 py-5 md:px-16 lg:hidden"
        >
          <ul className="flex flex-col gap-4 text-sm tracking-wide">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block font-bold text-foreground/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-5">
            <ShopNowButton />
          </div>
        </div>
      ) : null}
    </header>
  );
}
