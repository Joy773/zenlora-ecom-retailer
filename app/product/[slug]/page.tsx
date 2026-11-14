import { notFound } from "next/navigation";
import ProductDetail from "@/components/common/productDetail";
import RelatedProducts from "@/components/common/relatedProducts";
import { getStoreProductBySlug, getStoreProducts } from "@/lib/store-products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const instant = false;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getStoreProducts({
    category: product.category,
    subcategory: product.subcategory,
    excludeId: product.id,
    limit: 10,
  });

  const sizes = product.sizePrices.map((variant) => variant.size).filter(Boolean);
  const description = product.description || "No description available.";

  return (
    <>
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
        images={product.images}
        sizes={sizes}
        variants={product.sizePrices}
        inStock={product.inStock && product.quantity > 0}
        info={{
          description,
          aboutBrand: product.aboutBrand || "No brand information available.",
          howToUse: product.howToUse || "No usage instructions available.",
          keyBenefits: product.keyBenefits || "No key benefits available.",
          keyIngredients: product.keyIngredients || "No key ingredients available.",
          perfectFor: product.perfectFor || "No information available.",
        }}
      />
      <RelatedProducts products={relatedProducts} />
    </>
  );
}
