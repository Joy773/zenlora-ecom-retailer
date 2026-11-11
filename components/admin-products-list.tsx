"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AddProductModal,
  type ProductFormValues,
} from "@/components/AddProductModal";
import { mainCategories } from "@/components/admin-category";
import {
  ActiveButton,
  DeleteButton,
  DisableButton,
  UpdateButton,
} from "@/components/common/button";

type SavedProduct = {
  id: string;
  name: string;
  price: string;
  discountedPrice: string;
  discount: number | null;
  quantity: number;
  description: string;
  keyBenefits: string;
  keyIngredients: string;
  howToUse: string;
  perfectFor: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  seoSlug: string;
  images: string[];
  sizes: string[];
  sizePrices: {
    size: string;
    price: string;
    discountedPrice?: string;
    discountPercent?: number | null;
    images?: string[];
  }[];
  inStock: boolean;
  brand: string;
  format: string;
  aboutBrand: string;
  shipping: string;
  category: string;
  subcategory: string;
  isNewArrival: boolean;
  isOffer: boolean;
};

type AdminProduct = SavedProduct & {
  image: string;
  categoryLabel: string;
  subcategoryLabel: string;
};

function categoryLabel(value: string) {
  return mainCategories.find((item) => item.value === value)?.label ?? value;
}

function subcategoryLabel(category: string, subcategory: string) {
  const selected = mainCategories.find((item) => item.value === category);
  if (!selected) return subcategory;

  for (const group of selected.groups) {
    const match = group.items.find(
      (item) => `${item.param}:${item.value}` === subcategory,
    );
    if (match) return match.label;
  }

  return subcategory;
}

function toFormValues(product: AdminProduct): ProductFormValues {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    discountedPrice: product.discountedPrice,
    quantity: String(product.quantity),
    description: product.description,
    keyBenefits: product.keyBenefits,
    keyIngredients: product.keyIngredients,
    howToUse: product.howToUse,
    perfectFor: product.perfectFor,
    seoMetaTitle: product.seoMetaTitle,
    seoMetaDescription: product.seoMetaDescription,
    seoSlug: product.seoSlug,
    sizes: product.sizes,
    sizePrices: product.sizePrices,
    inStock: product.inStock,
    brand: product.brand,
    format: product.format,
    aboutBrand: product.aboutBrand,
    shipping: product.shipping,
    category: product.category,
    subcategory: product.subcategory,
    isNewArrival: product.isNewArrival,
    isOffer: product.isOffer,
  };
}

export default function AdminProductsList() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      const result = (await response.json().catch(() => null)) as {
        products?: SavedProduct[];
      } | null;

      if (!response.ok || !result?.products) {
        setStatus("error");
        return;
      }

      setProducts(
        result.products.map((product) => ({
          ...product,
          image: product.images[0] ?? "",
          categoryLabel: categoryLabel(product.category),
          subcategoryLabel: subcategoryLabel(product.category, product.subcategory),
        })),
      );
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProducts();
    }, 0);
    window.addEventListener("zenlora:products-changed", loadProducts);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("zenlora:products-changed", loadProducts);
    };
  }, [loadProducts]);

  const initialValues = useMemo(
    () => (editingProduct ? toFormValues(editingProduct) : null),
    [editingProduct],
  );

  const openUpdateModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  const deleteProduct = async (id: string) => {
    setDeleteError("");
    setDeletingId(id);

    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setDeleteError(result?.error ?? "Could not delete the product.");
        setDeletingId(null);
        return;
      }

      setProducts((current) => current.filter((product) => product.id !== id));
      setDeletingId(null);
    } catch {
      setDeleteError("Could not delete the product.");
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-xl border border-primary bg-background">
        {status === "loading" ? (
          <p className="p-5 text-[13px] text-foreground/60">Loading products...</p>
        ) : null}
        {status === "error" ? (
          <p className="p-5 text-[13px] text-red-600" role="alert">
            Could not load products.
          </p>
        ) : null}
        {deleteError ? (
          <p className="px-5 pt-5 text-[13px] text-red-600" role="alert">
            {deleteError}
          </p>
        ) : null}
        {status === "ready" && products.length === 0 ? (
          <p className="p-5 text-[13px] text-foreground/60">No products yet.</p>
        ) : null}
        {status === "ready" && products.length > 0 ? (
          <ul className="divide-y divide-foreground/10">
            {products.map((product) => {
              const salePrice = product.discountedPrice.trim();

              return (
                <li
                  key={product.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5"
                >
                  <div className="flex min-w-0 flex-1 gap-3 sm:contents">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f2f2f0] sm:h-24 sm:w-24">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : null}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[15px] font-medium break-words text-foreground">
                          {product.name}
                        </h2>
                        {product.isNewArrival ? (
                          <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-foreground uppercase">
                            New Arrival
                          </span>
                        ) : null}
                        {product.isOffer ? (
                          <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                            Offer
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-[12px] break-words text-foreground/55">
                        {product.categoryLabel} · {product.subcategoryLabel}
                      </p>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed break-words text-foreground/65">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-3 sm:shrink-0 sm:items-end">
                    <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-end sm:gap-2">
                      <div className="min-w-0 text-left sm:text-right">
                        <div className="flex flex-wrap items-baseline gap-2 sm:justify-end">
                          <span className="text-[15px] font-medium break-words text-foreground">
                            {salePrice || product.price}
                          </span>
                          {salePrice ? (
                            <span className="text-[13px] break-words text-foreground/45 line-through">
                              {product.price}
                            </span>
                          ) : null}
                        </div>
                        {product.discount !== null && product.discount > 0 ? (
                          <p className="mt-0.5 text-[12px] font-medium text-accent">
                            {product.discount}% off
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-[12px] text-foreground/60">
                        Qty: {product.quantity}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                      <ActiveButton className="w-full sm:w-auto" />
                      <DisableButton className="w-full sm:w-auto" />
                      <UpdateButton
                        onClick={() => openUpdateModal(product)}
                        className="w-full sm:w-auto"
                      />
                      <DeleteButton
                        onClick={() => deleteProduct(product.id)}
                        className={`w-full sm:w-auto ${deletingId === product.id ? "pointer-events-none opacity-60" : ""}`}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <AddProductModal
        open={open}
        onClose={closeModal}
        mode="update"
        initialValues={initialValues}
      />
    </>
  );
}
