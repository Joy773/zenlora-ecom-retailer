import { notFound } from "next/navigation";
import { getProductBySlug } from "@/components/common/allProducts";
import ProductDetail from "@/components/common/productDetail";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const sizes = ["30 ML", "50 ML", "100 ML"];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const description =
    product.description ??
    `${product.name} is a daily Zenlora essential, made for a calm and simple routine.`;

  return (
    <ProductDetail
      product={{
        slug: product.slug ?? slug,
        name: product.name,
        price: product.price,
        image: product.image,
        alt: product.alt,
        href: product.href,
      }}
      compareAtPrice={product.compareAtPrice}
      images={[{ src: product.image, alt: product.alt }]}
      sizes={sizes}
      info={{
        description: `${description} Choose the size that fits how often you use it. The 50 ML size is the everyday option, with 30 ML for travel and 100 ML for a longer routine.`,
        additional: [
          { label: "Size", value: "50 ML" },
          { label: "Brand", value: "Zenlora" },
          { label: "Format", value: "Skincare" },
        ],
        aboutBrand:
          "Zenlora makes quiet, everyday skincare. Each product is chosen to feel simple to use, gentle on skin, and easy to keep in a daily routine.",
        shipping:
          "Orders are packed within 1–2 business days. Delivery usually takes 2–4 business days. Free shipping applies on orders over $50.",
      }}
    />
  );
}
