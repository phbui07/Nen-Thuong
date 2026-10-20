import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import { getDictionary } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Gallery from "./components/gallery/gallery";
import Info from "./components/info";
import SuggestedList from "./components/suggested-list";

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProduct(productId);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const [product, t] = await Promise.all([getProduct(productId), getDictionary()]);
  if (!product) {
    notFound();
  }
  const related = (await getProducts({ category: product.category }))
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <Container className="px-4 pb-16 pt-8 md:px-12">
      <Breadcrumbs
        label={t.breadcrumb.label}
        items={[
          { label: t.breadcrumb.home, href: "/" },
          { label: t.breadcrumb.products, href: "/menu" },
          ...(product.category
            ? [{ label: product.category, href: `/menu?category=${encodeURIComponent(product.category)}` }]
            : []),
          { label: product.name },
        ]}
      />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
        <Gallery images={product.images ?? []} name={product.name} />
        <Info product={product} />
      </div>
      {related.length > 0 && <SuggestedList products={related} />}
    </Container>
  );
}
