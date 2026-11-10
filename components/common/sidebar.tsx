"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/change-password", label: "Change password" },
];

function navClassName(isActive: boolean) {
  return `rounded-full px-4 py-2 text-sm tracking-wide transition-colors ${
    isActive
      ? "bg-accent text-white"
      : "text-foreground/70 hover:bg-primary/60 hover:text-foreground"
  }`;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const logout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-primary bg-background px-4 py-3 md:hidden">
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium tracking-[0.2em] text-accent uppercase"
        >
          Zenlora
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary/60"
        >
          {menuOpen ? (
            <HiOutlineXMark className="h-6 w-6" />
          ) : (
            <HiOutlineBars3 className="h-6 w-6" />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu backdrop"
            className="absolute inset-0 bg-foreground/35"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-primary bg-background px-5 py-8">
            <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
              Zenlora
            </p>
            <p className="mt-2 font-serif text-2xl italic text-foreground">Admin</p>

            <nav className="mt-10 flex flex-1 flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navClassName(pathname === link.href)}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              disabled={isPending}
              onClick={logout}
              className="mt-6 rounded-full border border-accent px-4 py-2 text-sm font-medium tracking-wide text-accent transition-colors hover:bg-accent hover:text-white disabled:opacity-60"
            >
              {isPending ? "Logging out..." : "Logout"}
            </button>
          </aside>
        </div>
      ) : null}

      <aside className="hidden w-56 shrink-0 flex-col border-r border-primary bg-background px-5 py-8 md:flex">
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium tracking-[0.2em] text-accent uppercase"
        >
          Zenlora
        </Link>
        <p className="mt-2 font-serif text-2xl italic text-foreground">Admin</p>

        <nav className="mt-10 flex flex-1 flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navClassName(pathname === link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          disabled={isPending}
          onClick={logout}
          className="mt-6 rounded-full border border-accent px-4 py-2 text-sm font-medium tracking-wide text-accent transition-colors hover:bg-accent hover:text-white disabled:opacity-60"
        >
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </aside>
    </>
  );
}
