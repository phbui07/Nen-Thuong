import getCategories from "@/actions/get-categories";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import FilterContainer from "@/components/filter-container";
import CategoryFilters from "./components/category-filter";
import getSizes from "@/actions/get-sizes";
import SizeFilters from "./components/size-filter";
import getProducts from "@/actions/get-products";
import { getDictionary } from "@/lib/i18n/server";
import type { Metadata } from "next";
import PageContent from "./components/page-content";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.meta.products };
}

interface MenuProps {
  searchParams: Promise<{
    size?: string;
    isFeatured?: boolean;
    origin?: string;
    category?: string;
  }>;
}

export default async function MenuPage({ searchParams }: MenuProps) {
  const { size, isFeatured, category, origin } = await searchParams;
  const [categories, sizes, products, t] = await Promise.all([
    getCategories(),
    getSizes(),
    getProducts({ size, isFeatured, category, origin }),
    getDictionary(),
  ]);

  return (
    <Container className="px-4 pb-16 pt-8 md:px-12">
      <Breadcrumbs
        label={t.breadcrumb.label}
        items={[
          { label: t.breadcrumb.home, href: "/" },
          { label: t.breadcrumb.products, href: category ? "/menu" : undefined },
          ...(category ? [{ label: category }] : []),
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12">
        <aside className="md:col-span-3 lg:col-span-2">
          <FilterContainer className="md:sticky md:top-24">
            <CategoryFilters categories={categories} />
            <SizeFilters sizes={sizes} />
          </FilterContainer>
        </aside>
        <div className="md:col-span-9 lg:col-span-10">
          <PageContent products={products} />
        </div>
      </div>
    </Container>
  );
}
