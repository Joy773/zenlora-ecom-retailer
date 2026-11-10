"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { toast } from "react-toastify";
import { mainCategories } from "@/components/admin-category";
import Button, { AddProductButton } from "@/components/common/button";

export type ProductFormValues = {
  id?: string;
  name?: string;
  price?: string;
  discountedPrice?: string;
  quantity?: string;
  description?: string;
  imageNames?: string[];
  sizes?: string[];
  sizePrices?: { size: string; price: string; images?: string[] }[];
  inStock?: boolean;
  brand?: string;
  format?: string;
  aboutBrand?: string;
  shipping?: string;
  category?: string;
  subcategory?: string;
  isNewArrival?: boolean;
  isOffer?: boolean;
};

type ProductImageItem = {
  id: string;
  name: string;
  file?: File;
  previewUrl?: string;
};

type AddProductModalProps = {
  open: boolean;
  onClose: () => void;
  mode?: "add" | "update";
  initialValues?: ProductFormValues | null;
};

const inputClassName =
  "rounded-full border border-primary bg-white px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent";

const textareaClassName =
  "rounded-xl border border-primary bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent";

function parseMoney(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;

  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : null;
}

function getDiscountPercent(price: string, discountedPrice: string) {
  const original = parseMoney(price);
  const sale = parseMoney(discountedPrice);

  if (original === null || sale === null || original <= 0 || sale >= original) {
    return null;
  }

  return Math.round(((original - sale) / original) * 100);
}

function releaseImages(images: ProductImageItem[]) {
  images.forEach((image) => {
    if (image.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(image.previewUrl);
  });
}

export function AddProductModal({
  open,
  onClose,
  mode = "add",
  initialValues = null,
}: AddProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [sizePriceInput, setSizePriceInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizePrices, setSizePrices] = useState<
    { size: string; price: string; images: string[] }[]
  >([]);
  const [sizeImageFiles, setSizeImageFiles] = useState<Record<string, File[]>>({});
  const sizeImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [inStock, setInStock] = useState(true);
  const [brand, setBrand] = useState("Zenlora");
  const [format, setFormat] = useState("");
  const [aboutBrand, setAboutBrand] = useState("");
  const [shipping, setShipping] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedCategory = useMemo(
    () => mainCategories.find((item) => item.value === category) ?? null,
    [category],
  );

  const discountPercent = useMemo(
    () => getDiscountPercent(sizePrices[0]?.price ?? price, discountedPrice),
    [price, discountedPrice, sizePrices],
  );

  const resetForm = () => {
    setName("");
    setPrice("");
    setDiscountedPrice("");
    setQuantity("1");
    setDescription("");
    setImages((current) => {
      releaseImages(current);
      return [];
    });
    setSizeInput("");
    setSizePriceInput("");
    setSizes([]);
    setSizePrices([]);
    setSizeImageFiles({});
    setInStock(true);
    setBrand("Zenlora");
    setFormat("");
    setAboutBrand("");
    setShipping("");
    setCategory("");
    setSubcategory("");
    setIsNewArrival(false);
    setIsOffer(false);
    setIsSaving(false);
    setFormError("");
  };

  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      setName(initialValues.name ?? "");
      setPrice(initialValues.price ?? "");
      setDiscountedPrice(initialValues.discountedPrice ?? "");
      setQuantity(initialValues.quantity ?? "1");
      setDescription(initialValues.description ?? "");
      setImages((current) => {
        releaseImages(current);
        return (initialValues.imageNames ?? []).slice(0, 1).map((name) => ({
          id: name,
          name,
          previewUrl: name.startsWith("http") ? name : undefined,
        }));
      });
      setSizeInput("");
      setSizePriceInput("");
      setSizes(initialValues.sizes ?? []);
      setSizePrices(
        (initialValues.sizePrices ?? []).map((variant) => ({
          ...variant,
          images: variant.images ?? [],
        })),
      );
      setSizeImageFiles({});
      setInStock(initialValues.inStock ?? true);
      setBrand(initialValues.brand ?? "Zenlora");
      setFormat(initialValues.format ?? "");
      setAboutBrand(initialValues.aboutBrand ?? "");
      setShipping(initialValues.shipping ?? "");
      setCategory(initialValues.category ?? "");
      setSubcategory(initialValues.subcategory ?? "");
      setIsNewArrival(Boolean(initialValues.isNewArrival));
      setIsOffer(Boolean(initialValues.isOffer));
    } else {
      resetForm();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, initialValues]);

  if (!open) return null;

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubcategory("");
  };

  const addImages = (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const file = fileList[0];
    const next = {
      id: `${file.name}-${file.lastModified}-${file.size}-${crypto.randomUUID()}`,
      name: file.name,
      file,
      previewUrl: URL.createObjectURL(file),
    };

    setImages((current) => {
      releaseImages(current);
      return [next];
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const image = current.find((item) => item.id === id);
      if (image) releaseImages([image]);
      return current.filter((item) => item.id !== id);
    });
  };

  const addSize = () => {
    const next = sizeInput.trim();
    const nextPrice = sizePriceInput.trim();
    if (!next || !nextPrice) return;

    if (sizes.some((item) => item.toLowerCase() === next.toLowerCase())) return;
    setSizes((current) => [...current, next]);
    setSizePrices((current) => [...current, { size: next, price: nextPrice, images: [] }]);
    setSizeInput("");
    setSizePriceInput("");
  };

  const removeSize = (size: string) => {
    setSizes((current) => current.filter((item) => item !== size));
    setSizePrices((current) => current.filter((item) => item.size !== size));
    setSizeImageFiles((current) => {
      const next = { ...current };
      delete next[size];
      return next;
    });
  };

  const addSizeImages = (size: string, fileList: FileList | null) => {
    if (!fileList?.length) return;
    const files = Array.from(fileList);
    setSizeImageFiles((current) => ({
      ...current,
      [size]: [...(current[size] ?? []), ...files],
    }));
    if (sizeImageInputRefs.current[size]) {
      sizeImageInputRefs.current[size]!.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sizePrices[0]?.price && !price) {
      setFormError("Add at least one size with a price before saving.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    const formData = new FormData();
    if (mode === "update") {
      formData.set("id", initialValues?.id ?? "");
    }
    formData.set("name", name);
    formData.set("price", sizePrices[0]?.price ?? price);
    formData.set("discountedPrice", discountedPrice);
    formData.set("quantity", quantity);
    formData.set("description", description);
    formData.set("inStock", String(inStock));
    formData.set("brand", brand);
    formData.set("format", format);
    formData.set("aboutBrand", aboutBrand);
    formData.set("shipping", shipping);
    formData.set("category", category);
    formData.set("subcategory", subcategory);
    formData.set("isNewArrival", String(isNewArrival));
    formData.set("isOffer", String(isOffer));
    sizes.forEach((size) => formData.append("sizes", size));
    formData.set("sizePrices", JSON.stringify(sizePrices));
    sizePrices.forEach((variant) => {
      (sizeImageFiles[variant.size] ?? []).forEach((file) => {
        formData.append("sizeImages", file);
        formData.append("sizeImageSizes", variant.size);
      });
    });
    images.forEach((image) => {
      if (image.file) {
        formData.append("images", image.file);
      } else if (image.previewUrl?.startsWith("http")) {
        formData.append("existingImages", image.previewUrl);
      }
    });

    try {
      const response = await fetch("/api/products", {
        method: mode === "update" ? "PATCH" : "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setFormError(result?.error ?? "Could not save the product.");
        setIsSaving(false);
        return;
      }

      toast.success(mode === "update" ? "Product has been updated" : "Product has been saved");
      window.dispatchEvent(new Event("zenlora:products-changed"));
      onClose();
      resetForm();
    } catch {
      setFormError("Could not save the product.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-foreground/35"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-primary bg-background p-6 shadow-none md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
              Zenlora
            </p>
            <h2
              id="add-product-title"
              className="mt-2 font-serif text-3xl font-normal italic text-foreground"
            >
              {mode === "update" ? "Update Product" : "Add Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product modal"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-primary/60 hover:text-foreground"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              Product name
            </span>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClassName}
              placeholder="Daily SPF 50 Lotion"
            />
          </label>

          <div className="rounded-xl border border-primary bg-white p-4">
            <label className="flex flex-col gap-2">
              <span className="text-[12px] font-medium tracking-wide text-foreground/70">
                Discounted price
              </span>
              <p className="text-[12px] leading-relaxed text-foreground/55">
                Optional. Leave empty if the product has no discount.
              </p>
              <input
                type="text"
                name="discountedPrice"
                value={discountedPrice}
                onChange={(event) => setDiscountedPrice(event.target.value)}
                className={inputClassName}
                placeholder="$16"
              />
            </label>
            {discountPercent !== null ? (
              <p className="mt-3 text-[13px] font-medium text-accent">
                {discountPercent}% off
              </p>
            ) : discountedPrice.trim() ? (
              <p className="mt-3 text-[12px] text-foreground/55">
                Enter a discounted price lower than the original price.
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-primary bg-white p-4">
            <label className="flex flex-col gap-2">
              <span className="text-[12px] font-medium tracking-wide text-foreground/70">
                Quantity
              </span>
              <p className="text-[12px] leading-relaxed text-foreground/55">
                Available stock for this product.
              </p>
              <input
                type="number"
                name="quantity"
                min={0}
                step={1}
                required
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className={inputClassName}
                placeholder="1"
              />
            </label>
          </div>

          <div className="rounded-xl border border-primary bg-white p-4">
            <label className="flex flex-col gap-2">
              <span className="text-[12px] font-medium tracking-wide text-foreground/70">
                Description
              </span>
              <textarea
                name="description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="rounded-xl border border-primary bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-accent"
                placeholder="A thoughtfully chosen essential for calm, balanced routines."
              />
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              Product images
            </span>
            <input
              ref={imageInputRef}
              type="file"
              name="images"
              accept="image/*"
              onChange={(event) => addImages(event.target.files)}
              className="sr-only"
            />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
              >
                Add images
              </Button>
            </div>
            {images.length > 0 ? (
              <ul className="grid grid-cols-3 gap-3">
                {images.map((image) => (
                  <li key={image.id} className="relative">
                    <input type="hidden" name="imageNames" value={image.name} />
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-primary bg-white">
                      {image.previewUrl ? (
                        // Blob previews are created in the browser and are not known to the image optimizer.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.previewUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center px-2 text-center text-[11px] text-foreground/55">
                          {image.name}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      aria-label={`Remove ${image.name}`}
                      className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-foreground/60 shadow-sm transition-colors hover:text-foreground"
                    >
                      <HiOutlineXMark className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] text-foreground/55">
                Add one or more images for this product.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              Sizes
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={sizeInput}
                onChange={(event) => setSizeInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSize();
                  }
                }}
                className={inputClassName}
                placeholder="50 ML"
                aria-label="Size"
              />
              <input
                type="text"
                value={sizePriceInput}
                onChange={(event) => setSizePriceInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSize();
                  }
                }}
                className={`${inputClassName} w-28`}
                placeholder="Price"
                aria-label="Size price"
              />
              <Button type="button" variant="outline" onClick={addSize}>
                Add
              </Button>
            </div>
            {sizes.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <li key={size}>
                    <input type="hidden" name="sizes" value={size} />
                    {(() => {
                      const variant = sizePrices.find((item) => item.size === size);
                      const imageCount =
                        (variant?.images?.length ?? 0) +
                        (sizeImageFiles[size]?.length ?? 0);

                      return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary bg-white py-1 pr-1 pl-3 text-[13px] text-foreground">
                      {size} · {variant?.price}
                      <input
                        ref={(element) => {
                          sizeImageInputRefs.current[size] = element;
                        }}
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={(event) => addSizeImages(size, event.target.files)}
                        aria-label={`Add images for ${size}`}
                      />
                      <button
                        type="button"
                        onClick={() => sizeImageInputRefs.current[size]?.click()}
                        className="px-1 text-accent"
                        aria-label={`Add images for ${size}`}
                      >
                        {imageCount > 0 ? `${imageCount} image${imageCount === 1 ? "" : "s"}` : "+ image"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        aria-label={`Remove ${size}`}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-primary/60 hover:text-foreground"
                      >
                        <HiOutlineXMark className="h-3.5 w-3.5" />
                      </button>
                    </span>
                      );
                    })()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] text-foreground/55">
                Add each size the product is sold in.
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-foreground/70 transition-colors hover:text-foreground">
            <input
              type="checkbox"
              name="inStock"
              checked={inStock}
              onChange={(event) => setInStock(event.target.checked)}
              className="h-4 w-4 shrink-0 appearance-none rounded border border-foreground/20 checked:border-accent checked:bg-accent"
            />
            <span>In stock</span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              Brand
            </span>
            <input
              type="text"
              name="brand"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className={inputClassName}
              placeholder="Zenlora"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              Format
            </span>
            <input
              type="text"
              name="format"
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              className={inputClassName}
              placeholder="Skincare"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              About brand
            </span>
            <textarea
              name="aboutBrand"
              rows={4}
              value={aboutBrand}
              onChange={(event) => setAboutBrand(event.target.value)}
              className={textareaClassName}
              placeholder="Zenlora makes quiet, everyday skincare."
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              Shipping & Delivery
            </span>
            <textarea
              name="shipping"
              rows={4}
              value={shipping}
              onChange={(event) => setShipping(event.target.value)}
              className={textareaClassName}
              placeholder="Orders are packed within 1–2 business days."
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium tracking-wide text-foreground/70">
              Category
            </span>
            <select
              name="category"
              required
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className={inputClassName}
            >
              <option value="" disabled>
                Select category
              </option>
              {mainCategories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {selectedCategory ? (
            <div className="rounded-xl border border-primary bg-white p-4">
              <label className="flex flex-col gap-2">
                <span className="text-[12px] font-medium tracking-wide text-foreground/70">
                  Subcategory
                </span>
                <p className="text-[12px] leading-relaxed text-foreground/55">
                  Choose a subcategory under {selectedCategory.label}.
                </p>
                <select
                  name="subcategory"
                  required
                  value={subcategory}
                  onChange={(event) => setSubcategory(event.target.value)}
                  className={inputClassName}
                >
                  <option value="" disabled>
                    Select subcategory
                  </option>
                  {selectedCategory.groups.map((group) => (
                    <optgroup key={group.title} label={group.title}>
                      {group.items.map((item) => (
                        <option
                          key={`${item.param}-${item.value}`}
                          value={`${item.param}:${item.value}`}
                        >
                          {item.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          <fieldset className="rounded-xl border border-primary bg-white p-4">
            <legend className="px-1 text-[12px] font-medium tracking-wide text-foreground/70">
              Flags
            </legend>
            <p className="text-[12px] leading-relaxed text-foreground/55">
              Optional. Select one, both, or neither.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-foreground/70 transition-colors hover:text-foreground">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={isNewArrival}
                  onChange={(event) => setIsNewArrival(event.target.checked)}
                  className="h-4 w-4 shrink-0 appearance-none rounded border border-foreground/20 checked:border-accent checked:bg-accent"
                />
                <span>New Arrival</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-foreground/70 transition-colors hover:text-foreground">
                <input
                  type="checkbox"
                  name="offer"
                  checked={isOffer}
                  onChange={(event) => setIsOffer(event.target.checked)}
                  className="h-4 w-4 shrink-0 appearance-none rounded border border-foreground/20 checked:border-accent checked:bg-accent"
                />
                <span>Offer</span>
              </label>
            </div>
          </fieldset>

          {formError ? (
            <p className="text-[13px] text-red-600" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : mode === "update"
                  ? "Update product"
                  : "Save product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddProductAction() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddProductButton onClick={() => setOpen(true)} />
      <AddProductModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
