"use client";

import FilterGroup from "@/components/filter-group";
import { useLanguage } from "@/providers/language-provider";
import { Origin } from "@/types-db";

interface OriginFilterProps {
  origins: Origin[];
}

export default function OriginFilter({ origins }: OriginFilterProps) {
  const { t } = useLanguage();
  return <FilterGroup title={t.products.filterLabels.origin} paramKey="origin" options={origins} showValue />;
}
