import ProductForm from "@/components/admin/product-form";
import { requireAdminPage } from "@/lib/admin-guard";
import { listCategories, listSizes } from "@/lib/db/catalog";
import { getDictionary } from "@/lib/i18n/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function NewProductPage() {
  await requireAdminPage();
  const [t, categories, sizes] = await Promise.all([getDictionary(), listCategories(), listSizes()]);

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-hero">
        <ArrowLeft className="h-4 w-4" />
        {t.admin.products.back}
      </Link>
      <h2 className="text-2xl font-semibold text-neutral-800">{t.admin.products.newTitle}</h2>
      <ProductForm product={null} categories={categories} sizes={sizes} />
    </div>
  );
}
