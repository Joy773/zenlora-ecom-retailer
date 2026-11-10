"use client";

import Image from "next/image";
import { useState } from "react";
import {
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineMinus,
  HiOutlinePlus,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import type { CartProduct } from "@/context/cart-context";
import { useCart } from "@/context/cart-context";

export type ProductDetailInfo = {
  description: string;
  additional: { label: string; value: string }[];
  aboutBrand: string;
  shipping: string;
};

type ProductDetailProps = {
  product: CartProduct;
  compareAtPrice?: string;
  images: { src: string; alt: string }[];
  sizes: string[];
  info: ProductDetailInfo;
};

function DetailAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-foreground/10">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between py-4 text-left text-sm text-foreground"
        aria-expanded={open}
      >
        {title}
        <HiOutlineChevronDown
          className={`h-4 w-4 text-foreground/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? (
        <div className="pb-4 text-[13px] leading-relaxed text-foreground/70">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default function ProductDetail({
  product,
  compareAtPrice,
  images,
  sizes,
  info,
}: ProductDetailProps) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(sizes[1] ?? sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  const selectedImage = images[activeImage] ?? images[0];
  const variantName = size ? `${product.name} ${size}` : product.name;

  const handleAddToCart = () => {
    if (!size) {
      toast.error("Choose a size before adding this product to the cart.");
      return;
    }

    const sizeSlug = size.toLowerCase().replace(/\s+/g, "-");

    addItem(
      {
        ...product,
        slug: `${product.slug}-${sizeSlug}`,
        name: variantName,
      },
      quantity,
    );
    toast.success(
      quantity > 1
        ? `Added ${quantity} × ${variantName} to cart`
        : `Added ${variantName} to cart`,
    );
  };

  return (
    <section className="bg-white px-4 py-10 sm:px-8 sm:py-14 md:px-16 lg:px-20 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
        <div>
          <div className="relative aspect-square overflow-hidden bg-[#f6e7e2]">
            {selectedImage ? (
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : null}
          </div>
          {images.length > 0 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((image, index) => {
                const isActive = index === activeImage;

                return (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`relative aspect-square overflow-hidden bg-[#f6e7e2] ${
                      isActive ? "ring-1 ring-accent" : ""
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div>
          <h1 className="font-sans text-3xl font-semibold not-italic leading-tight text-foreground md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            {compareAtPrice ? (
              <p className="text-sm text-foreground/40 line-through">
                {compareAtPrice}
              </p>
            ) : null}
            <p className="text-xl font-semibold text-accent">{product.price}</p>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <label htmlFor="product-size" className="text-sm text-foreground/70">
                size:
              </label>
              <select
                id="product-size"
                value={size}
                onChange={(event) => setSize(event.target.value)}
                className="min-w-40 border border-foreground/15 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              >
                <option value="" disabled>
                  Select size
                </option>
                {sizes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {size ? (
                <button
                  type="button"
                  onClick={() => setSize("")}
                  className="text-sm text-foreground/45 transition-colors hover:text-foreground"
                >
                  × Clear
                </button>
              ) : null}
            </div>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-emerald-700">
            <HiOutlineCheck className="h-4 w-4" />
            In stock
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex h-11 items-center border border-foreground/15">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="flex h-11 w-10 items-center justify-center text-foreground/70"
              >
                <HiOutlineMinus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => value + 1)}
                className="flex h-11 w-10 items-center justify-center text-foreground/70"
              >
                <HiOutlinePlus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-11 rounded-full bg-accent px-6 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-accent/90"
            >
              Add to cart
            </button>
          </div>

          <div className="mt-8 border-t border-foreground/10">
            <DetailAccordion title="Description">
              <p>{info.description}</p>
            </DetailAccordion>
            <DetailAccordion title="Additional information">
              <dl className="grid gap-2">
                {info.additional.map((row) => (
                  <div key={row.label} className="grid grid-cols-[8rem_1fr] gap-3">
                    <dt className="text-foreground/50">{row.label}</dt>
                    <dd>
                      {row.label === "Size" ? size || "Select a size" : row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </DetailAccordion>
            <DetailAccordion title="About brand">
              <p>{info.aboutBrand}</p>
            </DetailAccordion>
            <DetailAccordion title="Shipping & Delivery">
              <p>{info.shipping}</p>
            </DetailAccordion>
          </div>
        </div>
      </div>
    </section>
  );
}
