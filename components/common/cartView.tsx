"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineTrash } from "react-icons/hi2";
import { formatCartMoney, useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format-price";
import Button from "./button";
import { QuantityStepper } from "./productCartActions";

export default function CartView() {
  const {
    items,
    itemCount,
    subtotal,
    isHydrated,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (!isHydrated) {
    return (
      <section className="px-8 py-14 md:px-16 lg:px-20 lg:py-16">
        <h1 className="font-serif text-4xl font-normal italic leading-none text-foreground md:text-5xl">
          Cart
        </h1>
        <p className="mt-5 text-[13px] text-foreground/60">Loading cart…</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="px-8 py-14 md:px-16 lg:px-20 lg:py-16">
        <h1 className="font-serif text-4xl font-normal italic leading-none text-foreground md:text-5xl">
          Cart
        </h1>
        <p className="mt-5 max-w-md text-[13px] leading-relaxed text-foreground/60">
          Your cart is empty. Browse skincare, haircare, or makeup to add
          products.
        </p>
        <div className="mt-8">
          <Button href="/skincare" variant="accent">
            Continue Shopping
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-14 md:px-16 lg:px-20 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-normal italic leading-none text-foreground md:text-5xl">
            Cart
          </h1>
          <p className="mt-3 text-[13px] text-foreground/60">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-[12px] font-medium tracking-wide text-foreground/55 transition-colors hover:text-accent"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
          {items.map((item) => (
            <li key={item.slug} className="flex gap-4 py-5 sm:gap-6">
              <Link
                href={item.href}
                className="relative h-24 w-24 shrink-0 overflow-hidden bg-[#f2f2f0] sm:h-28 sm:w-28"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <Link
                    href={item.href}
                    className="block text-[14px] leading-snug text-foreground transition-colors hover:text-accent"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-[14px] font-medium text-foreground">
                    {formatPrice(item.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    aria-label={`Remove ${item.name} from cart`}
                    title="Remove from cart"
                    className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-primary/50 hover:text-accent"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>

                <QuantityStepper
                  quantity={item.quantity}
                  onDecrement={() =>
                    setQuantity(item.slug, item.quantity - 1)
                  }
                  onIncrement={() =>
                    setQuantity(item.slug, item.quantity + 1)
                  }
                />
              </div>
            </li>
          ))}
        </ul>

        <aside className="rounded-xl border border-primary bg-background p-6">
          <h2 className="text-sm font-bold tracking-[0.15em] text-accent uppercase">
            Summary
          </h2>
          <div className="mt-4 flex items-center justify-between text-[14px] text-foreground">
            <span>Subtotal</span>
            <span className="font-medium">{formatCartMoney(subtotal)}</span>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-foreground/55">
            Shipping and taxes calculated at checkout.
          </p>
          <Button variant="accent" className="mt-6 w-full rounded-full">
            Checkout
          </Button>
        </aside>
      </div>
    </section>
  );
}
