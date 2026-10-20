import { formatPrice } from "@/components/convert";
import { Button } from "@/components/ui/button";
import { requireAdminPage } from "@/lib/admin-guard";
import { listProducts } from "@/lib/db/catalog";
import { getDictionary } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import { Flame, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminProductsPage() {
  await requireAdminPage();
  const [t, products] = await Promise.all([getDictionary(), listProducts({ includeArchived: true })]);
  const p = t.admin.products;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-neutral-800">{p.title}</h2>
        <Button asChild className="rounded-full bg-hero hover:bg-hero/90">
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            {p.add}
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="rounded-2xl bg-cream p-6 text-center text-sm text-muted-foreground">{p.empty}</p>
      ) : (
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/admin/products/${product.id}`}
                className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-cream/60 md:px-5"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                  {product.images[0]?.url ? (
                    <Image src={product.images[0].url} alt="" fill sizes="56px" className="object-contain p-1" />
                  ) : (
                    <Flame className="absolute inset-0 m-auto h-5 w-5 text-hero/30" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("line-clamp-1 font-semibold", product.isArchived ? "text-neutral-400" : "text-neutral-800")}>
                    {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[product.category, product.size].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <div className="hidden flex-wrap justify-end gap-1.5 sm:flex">
                  {product.isFeatured && (
                    <span className="rounded-full bg-hero/10 px-2.5 py-0.5 text-xs font-medium text-hero">{p.featuredBadge}</span>
                  )}
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      product.isArchived ? "bg-neutral-100 text-neutral-500" : "bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {product.isArchived ? p.hidden : p.active}
                  </span>
                </div>
                <p className="whitespace-nowrap font-semibold text-neutral-900">{formatPrice(product.price, t.locale)}</p>
                <Pencil className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-hero" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
