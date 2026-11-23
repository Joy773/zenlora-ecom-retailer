import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductGridSkeleton from "@/components/common/productGridSkeleton";
import ProductDetail from "@/components/common/productDetail";
import ProductDetailSkeleton from "@/components/common/productDetailSkeleton";
import RelatedProducts from "@/components/common/relatedProducts";
import { getStoreProductBySlug } from "@/lib/store-products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const instant = false;

export default function ProductPage(props: ProductPageProps) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductPageContent {...props} />
    </Suspense>
  );
}

async function ProductPageContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const sizes = product.sizePrices.map((variant) => variant.size).filter(Boolean);
  const description = product.description || "No description available.";

  return (
    <>
      <ProductDetail
        product={{
          productId: product.id,
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
      <Suspense
        fallback={
          <div className="px-8 py-12 md:px-16 lg:px-20">
            <ProductGridSkeleton singleRow />
          </div>
        }
      >
        <RelatedProducts
          category={product.category}
          subcategory={product.subcategory}
          id={product.id}
        />
      </Suspense>
    </>
  );
}
