"use client";

import FilterGroup from "@/components/filter-group";
import { Kitchen } from "@/types-db";

interface KitchenFiltersProps {
  kitchens: Kitchen[];
}

export default function KitchenFilters({ kitchens }: KitchenFiltersProps) {
  return <FilterGroup title={"Kitchen"} paramKey="kitchen" options={kitchens} showValue />;
}
