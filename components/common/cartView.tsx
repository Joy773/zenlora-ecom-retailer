"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { toast } from "react-toastify";
import { formatCartMoney, useCart } from "@/context/cart-context";
import { getDeliveryFee } from "@/lib/delivery";
import { formatPrice } from "@/lib/format-price";
import Button from "./button";
import ConfirmOderModal from "@/components/confirmOderModal";
import LoginSignupModal from "@/components/common/login&signup-modal";
import { QuantityStepper } from "./productCartActions";

const checkoutResumeKey = "zenlora:checkout-resume";
const checkoutIntentKey = "zenlora:checkout-intent";

export default function CartView() {
  const { data: session, status: sessionStatus } = useSession();
  const {
    items,
    itemCount,
    subtotal,
    isHydrated,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: "",
    contact: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);
  const orderRequestId = useRef<string | null>(null);
  const city = deliveryDetails.city;
  const deliveryFee = getDeliveryFee(city);

  const closeSignIn = useCallback(() => {
    try {
      sessionStorage.removeItem(checkoutIntentKey);
    } catch {
      // Closing the dialog still works when storage is unavailable.
    }
    setSignInOpen(false);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let savedDetails: unknown;
    try {
      const stored = sessionStorage.getItem(checkoutResumeKey);
      if (!stored) return;
      savedDetails = JSON.parse(stored);
    } catch {
      try {
        sessionStorage.removeItem(checkoutResumeKey);
      } catch {
        // The stored checkout intent cannot be recovered in this browser.
      }
      return;
    }

    if (
      typeof savedDetails !== "object" ||
      savedDetails === null ||
      !["fullName", "contact", "address", "city", "zipCode"].every(
        (field) => typeof (savedDetails as Record<string, unknown>)[field] === "string",
      )
    ) {
      try {
        sessionStorage.removeItem(checkoutResumeKey);
      } catch {
        // Ignore unavailable session storage.
      }
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setDeliveryDetails(savedDetails as typeof deliveryDetails);
      let shouldResumeCheckout = false;
      try {
        shouldResumeCheckout =
          sessionStorage.getItem(checkoutIntentKey) === "true";
      } catch {
        // Keep restored delivery details even if browser storage is unavailable.
      }
      if (
        sessionStatus === "authenticated" &&
        session?.user.role === "customer" &&
        shouldResumeCheckout
      ) {
        setSignInOpen(false);
        setCheckoutOpen(true);
        try {
          sessionStorage.removeItem(checkoutIntentKey);
        } catch {
          // The modal can still open if browser storage becomes unavailable.
        }
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isHydrated, session?.user.role, sessionStatus]);

  const updateDeliveryField = (
    field: keyof typeof deliveryDetails,
    value: string,
  ) => {
    const updated = { ...deliveryDetails, [field]: value };
    setDeliveryDetails(updated);
    try {
      sessionStorage.setItem(checkoutResumeKey, JSON.stringify(updated));
    } catch {
      // Keep the current form usable when browser storage is unavailable.
    }
    orderRequestId.current = null;
  };

  const clearCartItems = () => {
    orderRequestId.current = null;
    clearCart();
  };

  const changeItemQuantity = (slug: string, quantity: number) => {
    orderRequestId.current = null;
    setQuantity(slug, quantity);
  };

  const handleCheckout = () => {
    const hasMissingField = Object.values(deliveryDetails).some(
      (value) => !value.trim(),
    );
    if (hasMissingField) {
      toast.error("Fill all the fields.");
      return;
    }

    if (sessionStatus === "loading") return;

    if (session?.user.role === "customer") {
      orderRequestId.current ??= crypto.randomUUID();
      setCheckoutOpen(true);
      return;
    }

    try {
      sessionStorage.setItem(checkoutResumeKey, JSON.stringify(deliveryDetails));
      sessionStorage.setItem(checkoutIntentKey, "true");
    } catch {
      toast.error("Unable to resume checkout after sign-in. Please try again.");
      return;
    }
    setSignInOpen(true);
  };

  const handleConfirmOrder = async () => {
    if (isSubmittingOrder) return;

    orderRequestId.current ??= crypto.randomUUID();
    setIsSubmittingOrder(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: orderRequestId.current,
          expectedSubtotal: subtotal,
          deliveryDetails,
          items: items.map((item) => ({
            productId: item.productId,
            href: item.href,
            variantSize: item.variantSize,
            quantity: item.quantity,
          })),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        orderNumber?: unknown;
        error?: unknown;
      };

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "We could not save your order. Please try again.",
        );
      }
      if (typeof result.orderNumber !== "string") {
        throw new Error("The order was saved, but we could not read its number.");
      }

      clearCart();
      setCheckoutOpen(false);
      orderRequestId.current = null;
      toast.success(`Order ${result.orderNumber} has been placed.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not save your order. Please try again.",
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

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
          onClick={clearCartItems}
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
                  onClick={() => {
                    orderRequestId.current = null;
                    removeItem(item.slug);
                  }}
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
                    changeItemQuantity(item.slug, item.quantity - 1)
                  }
                  onIncrement={() =>
                    changeItemQuantity(item.slug, item.quantity + 1)
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
                Delivery is ৳70 in Dhaka and ৳130 outside Dhaka. Enter your city at checkout.
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
                  value={deliveryDetails.fullName}
                  onChange={(event) =>
                    updateDeliveryField("fullName", event.currentTarget.value)
                  }
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
                  value={deliveryDetails.contact}
                  onChange={(event) =>
                    updateDeliveryField(
                      "contact",
                      event.currentTarget.value.replace(/[^0-9+()\s-]/g, ""),
                    )
                  }
                  inputMode="tel"
                  pattern="[0-9+() -]+"
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
                  value={deliveryDetails.address}
                  onChange={(event) =>
                    updateDeliveryField("address", event.currentTarget.value)
                  }
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
                    onChange={(event) =>
                      updateDeliveryField("city", event.currentTarget.value)
                    }
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
                    value={deliveryDetails.zipCode}
                    onChange={(event) =>
                      updateDeliveryField("zipCode", event.currentTarget.value)
                    }
                    autoComplete="postal-code"
                    placeholder="ZIP code"
                    className="min-w-0 rounded-lg border border-primary bg-white px-3 py-2 text-[12px] text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent"
                  />
                </label>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="accent"
            onClick={handleCheckout}
            disabled={sessionStatus === "loading"}
            className="mt-6 w-full rounded-full"
          >
            {sessionStatus === "loading" ? "Checking account…" : "Checkout"}
          </Button>
        </aside>
      </div>
      {checkoutOpen ? (
        <ConfirmOderModal
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          city={city}
          onClose={closeCheckout}
          onConfirm={handleConfirmOrder}
          isSubmitting={isSubmittingOrder}
        />
      ) : null}
      <LoginSignupModal
        open={signInOpen}
        onClose={closeSignIn}
        redirectTo="/cart"
      />
    </section>
  );
}
