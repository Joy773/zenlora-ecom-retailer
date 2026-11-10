"use client";

import { useState } from "react";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";
import { toast } from "react-toastify";
import type { CartProduct } from "@/context/cart-context";
import { useCart } from "@/context/cart-context";
import { AddToCartButton } from "./button";

function addToCartWithToast(
  addItem: (product: CartProduct, quantity?: number) => void,
  product: CartProduct,
  quantity = 1,
) {
  addItem(product, quantity);
  toast.success(
    quantity > 1
      ? `Added ${quantity} × ${product.name} to cart`
      : `Added ${product.name} to cart`,
  );
}

export function QuantityStepper({
  quantity,
  onDecrement,
  onIncrement,
}: {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 text-foreground/70 transition-colors hover:border-accent hover:text-accent"
      >
        <HiOutlineMinus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-5 text-center text-[12px] font-medium text-foreground">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Increase quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 text-foreground/70 transition-colors hover:border-accent hover:text-accent"
      >
        <HiOutlinePlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ProductDetailCartActions({ product }: { product: CartProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <QuantityStepper
        quantity={quantity}
        onDecrement={() => setQuantity((value) => Math.max(1, value - 1))}
        onIncrement={() => setQuantity((value) => value + 1)}
      />
      <AddToCartButton
        className="rounded-full px-5 py-2.5 text-sm font-medium tracking-wide"
        onClick={() => addToCartWithToast(addItem, product, quantity)}
      />
    </div>
  );
}

export function ProductCardAddToCart({ product }: { product: CartProduct }) {
  const { addItem } = useCart();

  return (
    <AddToCartButton
      onClick={() => addToCartWithToast(addItem, product)}
    />
  );
}

export function ProductCardCartActions({
  product,
  children,
}: {
  product: CartProduct;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        {children}
        <ProductCardAddToCart product={product} />
      </div>
    </div>
  );
}
