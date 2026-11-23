"use client";

import { useEffect } from "react";
import { HiOutlineExclamationTriangle, HiOutlineXMark } from "react-icons/hi2";
import { formatCartMoney } from "@/context/cart-context";

type ConfirmOderModalProps = {
  subtotal: number;
  deliveryFee: number | null;
  city: string;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

export default function ConfirmOderModal({
  subtotal,
  deliveryFee,
  city,
  onClose,
  onConfirm,
  isSubmitting,
}: ConfirmOderModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  const total = deliveryFee === null ? null : subtotal + deliveryFee;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-order-title"
        aria-describedby="confirm-order-description"
        className="relative w-full max-w-md rounded-2xl border border-primary bg-background p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close order confirmation"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-foreground/55 transition hover:bg-primary/40 hover:text-foreground"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <HiOutlineExclamationTriangle className="h-6 w-6" aria-hidden="true" />
        </div>

        <h2
          id="confirm-order-title"
          className="mt-5 font-serif text-2xl font-semibold text-foreground"
        >
          Confirm your order?
        </h2>
        <p
          id="confirm-order-description"
          className="mt-2 text-sm leading-relaxed text-foreground/65"
        >
          Are you sure you want to confirm the order with these delivery details?
          Please make sure your contact number and address are correct.
        </p>

        <div className="mt-6 rounded-xl border border-primary/80 bg-white/70 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-foreground/65">Subtotal</span>
            <span className="font-medium tabular-nums">{formatCartMoney(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <span className="text-foreground/65">
              {city.trim() ? `Delivery to ${city.trim()}` : "Delivery"}
            </span>
            <span className="font-medium tabular-nums">
              {deliveryFee === null ? "Enter your city" : formatCartMoney(deliveryFee)}
            </span>
          </div>
          <div className="mt-3 flex justify-between gap-4 border-t border-primary pt-3 font-semibold">
            <span>Total</span>
            <span className="tabular-nums">
              {total === null ? "—" : formatCartMoney(total)}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-primary px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-65"
          >
            {isSubmitting ? "Saving order…" : "Yes, confirm"}
          </button>
        </div>
      </section>
    </div>
  );
}
