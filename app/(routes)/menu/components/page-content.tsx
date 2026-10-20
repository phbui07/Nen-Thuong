"use client";

import EmptyState from "@/components/empty-state";
import PopularContent from "@/components/popular-content";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";
import { Products } from "@/types-db";
import { PackageOpen, SearchX, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

interface PageContentProps {
  products: Products[];
}

export default function PageContent({ products }: PageContentProps) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentParams = Object.fromEntries(searchParams.entries());
  // Only filters the page understands get a removable chip
  const activeFilters = Object.entries(currentParams).filter(([key]) => key in t.products.filterLabels);
  const category = searchParams.get("category");

  const removeFilter = (param: string) => {
    const newParams = { ...currentParams };
    delete newParams[param];
    const href = queryString.stringifyUrl({
      url: "/menu",
      query: newParams,
    });
    router.push(href, { scroll: false });
  };

  const clearFilters = () => router.push("/menu", { scroll: false });

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-neutral-800">{category ?? t.products.allProducts}</h1>
        <p className="text-sm text-muted-foreground">{t.products.count(products.length)}</p>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeFilters.map(([key, value]) => {
            const label = t.products.filterLabels[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => removeFilter(key)}
                aria-label={t.products.removeFilter(label)}
                className="flex items-center gap-1.5 rounded-full bg-hero/10 px-3 py-1 text-sm text-hero transition hover:bg-hero/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero"
              >
                {key === "isFeatured" ? t.products.featured : `${label}: ${value}`}
                <X className="h-3.5 w-3.5" />
              </button>
            );
          })}
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-neutral-500 underline-offset-4 hover:text-hero hover:underline"
          >
            {t.products.clearFilters}
          </button>
        </div>
      )}

      {products.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <PopularContent data={product} key={product.id} />
          ))}
        </div>
      ) : activeFilters.length > 0 ? (
        <EmptyState
          className="mt-6"
          icon={SearchX}
          title={t.products.emptyFilteredTitle}
          description={t.products.emptyFilteredText}
          action={
            <Button variant={"outline"} className="rounded-full" onClick={clearFilters}>
              {t.products.clearFilters}
            </Button>
          }
        />
      ) : (
        <EmptyState className="mt-6" icon={PackageOpen} title={t.products.emptyTitle} description={t.products.emptyText} />
      )}
    </>
  );
}
