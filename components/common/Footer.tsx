import { Montserrat } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
  weight: ["700", "800"],
  subsets: ["latin"],
});

const shopLinks = [
  { href: "/shop?category=skincare", label: "Skincare" },
  { href: "/shop?category=makeup", label: "Makeup" },
  { href: "/shop?category=haircare", label: "Haircare" },
  { href: "/shop?category=bath-body", label: "Bath & Body" },
  { href: "/shop?category=beauty-accessories", label: "Beauty Accessories" },
];

const discoverLinks = [
  { href: "/brands", label: "Brands" },
  { href: "/shop?sort=best-sellers", label: "Best Sellers" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/offers", label: "Offers" },
];

const helpLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
  { href: "/shop", label: "Shop All" },
  { href: "/privacy-policy", label: "Privacy & Policy" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-primary bg-primary/40">
      <div className="grid gap-10 px-8 py-14 md:grid-cols-2 md:px-16 lg:grid-cols-4 lg:gap-12 lg:px-20 lg:py-16">
        <div className="md:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className={`${montserrat.className} text-2xl font-bold uppercase leading-none tracking-[0.25em] text-foreground`}
          >
            ZenLora
          </Link>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-foreground/70">
            Thoughtful skincare and beauty for calm, balanced routines
            curated for Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:contents">
          <div>
            <p className="text-[13px] font-bold tracking-wide text-foreground">
              Shop
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-[13px]">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-bold tracking-wide text-foreground">
              Discover
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-[13px]">
              {discoverLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="text-[13px] font-bold tracking-wide text-foreground">
            Help
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-[13px]">
            {helpLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-foreground/70 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary px-8 py-4 md:px-16 lg:px-20">
        <p className="text-xs text-foreground/60">
          © 2026 Zenlora. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
