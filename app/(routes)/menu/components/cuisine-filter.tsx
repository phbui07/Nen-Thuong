"use client";

import FilterGroup from "@/components/filter-group";
import { Cuisines } from "@/types-db";

interface CuisineFiltersProps {
  cuisines: Cuisines[];
}

export default function CuisineFilters({ cuisines }: CuisineFiltersProps) {
  return <FilterGroup title={"Cuisine"} paramKey="cuisine" options={cuisines} showValue />;
}
