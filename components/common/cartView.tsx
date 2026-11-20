"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { formatCartMoney, useCart } from "@/context/cart-context";
import { getDeliveryFee } from "@/lib/delivery";
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
  const [city, setCity] = useState("");
  const deliveryFee = getDeliveryFee(city);

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
          <div aria-live="polite" aria-atomic="true" className="mt-2">
            {deliveryFee === null ? (
              <p className="text-[12px] leading-relaxed text-foreground/55">
                Enter your city to see the delivery charge.
              </p>
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-3 text-[14px]">
                  <span className="min-w-0 break-words">Delivery to {city.trim()}</span>
                  <span>{formatCartMoney(deliveryFee)}</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-primary pt-3 text-[14px] font-semibold">
                  <span>Total</span>
                  <span>{formatCartMoney(subtotal + deliveryFee)}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 border-t border-primary pt-5">
            <h3 className="text-[12px] font-bold tracking-[0.12em] text-foreground uppercase">
              Delivery details
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-foreground/65">
                  Full Name
                </span>
                <input
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Your full name"
                  className="rounded-lg border border-primary bg-white px-3 py-2 text-[12px] text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-foreground/65">
                  Contact
                </span>
                <input
                  type="tel"
                  name="contact"
                  autoComplete="tel"
                  placeholder="Phone number"
                  className="rounded-lg border border-primary bg-white px-3 py-2 text-[12px] text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-foreground/65">
                  Address
                </span>
                <textarea
                  name="address"
                  autoComplete="street-address"
                  rows={2}
                  placeholder="House, road, area"
                  className="resize-none rounded-lg border border-primary bg-white px-3 py-2 text-[12px] text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-foreground/65">
                    City
                  </span>
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={(event) => setCity(event.currentTarget.value)}
                    autoComplete="address-level2"
                    placeholder="City"
                    className="min-w-0 rounded-lg border border-primary bg-white px-3 py-2 text-[12px] text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent"
                  />
                </label>
                <label className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[11px] font-medium text-foreground/65">
                    ZIP Code
                  </span>
                  <input
                    type="text"
                    name="zipCode"
                    autoComplete="postal-code"
                    placeholder="ZIP code"
                    className="min-w-0 rounded-lg border border-primary bg-white px-3 py-2 text-[12px] text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent"
                  />
                </label>
              </div>
            </div>
          </div>
          <Button variant="accent" className="mt-6 w-full rounded-full">
            Checkout
          </Button>
        </aside>
      </div>
    </section>
  );
}
