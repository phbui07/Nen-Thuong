import ProductForm from "@/components/admin/product-form";
import { requireAdminPage } from "@/lib/admin-guard";
import { getProductById, listCategories, listSizes } from "@/lib/db/catalog";
import { getDictionary } from "@/lib/i18n/server";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  await requireAdminPage();
  const { productId } = await params;
  const [t, product, categories, sizes] = await Promise.all([
    getDictionary(),
    getProductById(productId, { includeArchived: true }),
    listCategories(),
    listSizes(),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-hero">
        <ArrowLeft className="h-4 w-4" />
        {t.admin.products.back}
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-neutral-800">{t.admin.products.editTitle}</h2>
        {!product.isArchived && (
          <Link href={`/menu/${product.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-hero hover:underline">
            {t.admin.viewStore}
            <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </div>
      <ProductForm product={product} categories={categories} sizes={sizes} />
    </div>
  );
}
