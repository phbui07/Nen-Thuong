"use client";

import FilterGroup from "@/components/filter-group";
import { useLanguage } from "@/providers/language-provider";
import { Category } from "@/types-db";

interface CategoryFiltersProps {
  categories: Category[];
}

export default function CategoryFilters({ categories }: CategoryFiltersProps) {
  const { t } = useLanguage();
  return <FilterGroup title={t.products.categories} paramKey="category" options={categories} />;
}
