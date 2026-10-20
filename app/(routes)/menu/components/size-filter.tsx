"use client";

import FilterGroup from "@/components/filter-group";
import { useLanguage } from "@/providers/language-provider";
import { Size } from "@/types-db";

interface SizeFiltersProps {
  sizes: Size[];
}

export default function SizeFilters({ sizes }: SizeFiltersProps) {
  const { t } = useLanguage();
  return <FilterGroup title={t.products.sizes} paramKey="size" options={sizes} showValue />;
}
