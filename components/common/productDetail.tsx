"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineMinus,
  HiOutlinePlus,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import type { CartProduct } from "@/context/cart-context";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format-price";

export type ProductDetailInfo = {
  description: string;
  aboutBrand: string;
  howToUse: string;
  keyBenefits: string;
  keyIngredients: string;
  perfectFor: string;
};

type ProductDetailProps = {
  product: CartProduct;
  compareAtPrice?: string;
  images: { src: string; alt: string }[];
  sizes: string[];
  variants?: {
    size: string;
    price: string;
    discountedPrice: string;
    images?: string[];
    inStock?: boolean;
  }[];
  inStock?: boolean;
  info: ProductDetailInfo;
};

const detailTabs = [
  { key: "description", label: "Description" },
  { key: "aboutBrand", label: "About brand" },
  { key: "howToUse", label: "How to use" },
  { key: "keyBenefits", label: "Key Benefits" },
  { key: "keyIngredients", label: "Key Ingredients" },
  { key: "perfectFor", label: "Perfect For" },
] as const;

type DetailTabKey = (typeof detailTabs)[number]["key"];

export default function ProductDetail({
  product,
  compareAtPrice,
  images,
  sizes,
  variants = [],
  inStock = true,
  info,
}: ProductDetailProps) {
  const { addItem } = useCart();
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(sizes[1] ?? sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<DetailTabKey>("description");

  const selectedVariant =
    variants.find((variant) => variant.size === size) ?? variants[0];
  const selectedInStock = inStock && (selectedVariant?.inStock ?? true);
  const displayedImages =
    selectedVariant?.images?.length
      ? selectedVariant.images.map((src) => ({
          src,
          alt: `${product.name} ${selectedVariant.size}`,
        }))
      : images;
  const selectedPrice =
    selectedVariant?.discountedPrice || selectedVariant?.price || product.price;
  const selectedCompareAtPrice = selectedVariant?.discountedPrice
    ? selectedVariant.price
    : compareAtPrice;
  const selectedImage = displayedImages[activeImage] ?? displayedImages[0];
  const variantName = size ? `${product.name} ${size}` : product.name;
  const activeText = info[activeTab] || "No information available.";

  const handleAddToCart = () => {
    if (!selectedInStock) {
      toast.error("This product is currently out of stock.");
      return;
    }

    if (!size) {
      toast.error("Choose a size before adding this product to the cart.");
      return;
    }

    const sizeSlug = size.toLowerCase().replace(/\s+/g, "-");

    addItem(
      {
        ...product,
        price: selectedPrice,
          variantSize: size,
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
    <section className="bg-white px-8 py-10 sm:py-14 md:px-16 lg:px-20 lg:py-16">
      <div className="grid w-full grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
        <div className="min-w-0 md:w-[92%]">
          {displayedImages.length > 0 ? (
            <div
              key={`${product.slug}-${size}`}
              ref={mobileGalleryRef}
              role="region"
              aria-label="Product images"
              tabIndex={0}
              onScroll={(event) => {
                const gallery = event.currentTarget;
                if (gallery.clientWidth > 0) {
                  setActiveImage(
                    Math.min(
                      displayedImages.length - 1,
                      Math.max(0, Math.round(gallery.scrollLeft / gallery.clientWidth)),
                    ),
                  );
                }
              }}
              className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-color:var(--color-accent)_#f6e7e2] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar-track]:bg-[#f6e7e2] md:hidden"
            >
              {displayedImages.map((image, index) => (
                <div
                  key={`${image.src}-${index}`}
                  className="relative aspect-square w-full shrink-0 snap-start overflow-hidden bg-[#f6e7e2]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) calc(100vw - 4rem), 50vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className={`relative aspect-square overflow-hidden bg-[#f6e7e2] ${selectedImage ? "hidden md:block" : ""}`}>
            {selectedImage ? (
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center px-4 text-center text-md text-foreground/55">
                Product image is not available
              </span>
            )}
          </div>
          {displayedImages.length > 0 ? (
            <div
              role="region"
              aria-label="Product image thumbnails"
              className="mt-4 grid grid-cols-4 gap-3"
            >
              {displayedImages.map((image, index) => {
                const isActive = index === activeImage;

                return (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveImage(index);
                      const gallery = mobileGalleryRef.current;
                      if (gallery && gallery.clientWidth > 0) {
                        gallery.scrollTo({ left: index * gallery.clientWidth });
                      }
                    }}
                    aria-label={`Show image ${index + 1}`}
                    aria-pressed={isActive}
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
            {selectedCompareAtPrice ? (
              <p className="text-sm text-foreground/40 line-through">
                {formatPrice(selectedCompareAtPrice)}
              </p>
            ) : null}
            <p className="text-xl font-semibold text-accent">{formatPrice(selectedPrice)}</p>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <label htmlFor="product-size" className="text-sm text-foreground/70">
                size:
              </label>
              <div className="relative">
                <select
                  id="product-size"
                  value={size}
                  onChange={(event) => {
                    setSize(event.target.value);
                    setActiveImage(0);
                  }}
                  className="min-w-40 appearance-none border border-foreground/15 bg-white px-3 py-2 pr-9 text-sm text-foreground outline-none focus:border-accent"
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
                <HiOutlineChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-foreground/60" />
              </div>
              {size ? (
                <button
                  type="button"
                  onClick={() => {
                    setSize("");
                    setActiveImage(0);
                  }}
                  className="text-sm text-foreground/45 transition-colors hover:text-foreground"
                >
                  × Clear
                </button>
              ) : null}
            </div>
          </div>

          <p
            className={`mt-5 flex items-center gap-2 text-sm ${
              selectedInStock ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {selectedInStock ? <HiOutlineCheck className="h-4 w-4" /> : null}
            {selectedInStock ? "In stock" : "Out of stock"}
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
              disabled={!selectedInStock}
              onClick={handleAddToCart}
              className="h-11 rounded-full bg-accent px-6 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {selectedInStock ? "Add to cart" : "Out of stock"}
            </button>
          </div>

          <div className="mt-8 border-t border-foreground/10">
            <div
              role="tablist"
              aria-label="Product information"
              className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain border-b border-foreground/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6"
            >
              {detailTabs.map((tab) => {
                const isActive = tab.key === activeTab;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    aria-selected={isActive}
                    role="tab"
                    className={`shrink-0 snap-start whitespace-nowrap border-b-2 px-4 py-4 text-left text-[13px] font-semibold transition-colors sm:px-2 sm:text-center sm:whitespace-normal ${
                      isActive
                        ? "border-accent text-accent"
                        : "border-transparent text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div
              role="tabpanel"
              className="min-h-24 py-5 text-[13px] leading-relaxed text-foreground/70"
            >
              <p>{activeText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
