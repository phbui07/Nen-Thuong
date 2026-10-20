"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useTransition } from "react";

export interface FilterOption {
  id: string;
  name: string;
  value?: string;
}

interface FilterGroupProps {
  title: string;
  // Search param this group controls, e.g. "category"
  paramKey: string;
  options: FilterOption[];
  showValue?: boolean;
}

export default function FilterGroup({ title, paramKey, options, showValue = false }: FilterGroupProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const selected = searchParams.get(paramKey);

  const handleClick = (name: string) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    if (currentParams[paramKey] === name) {
      delete currentParams[paramKey];
    } else {
      currentParams[paramKey] = name;
    }
    const href = qs.stringifyUrl({
      url: "/menu",
      query: currentParams,
    });

    startTransition(() => router.push(href, { scroll: false }));
  };

  if (!options?.length) {
    return null;
  }

  return (
    <div className="space-y-3" aria-busy={isPending}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      {/* Chips that scroll sideways on phones, a vertical list from md up */}
      <div
        className={cn(
          "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 transition-opacity md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0",
          isPending && "opacity-60"
        )}
      >
        {options.map((option) => {
          const active = option.name === selected;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleClick(option.name)}
              aria-pressed={active}
              className={cn(
                "flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero md:rounded-lg md:border-transparent md:px-3 md:py-2",
                active
                  ? "border-hero bg-hero text-white md:bg-hero/10 md:text-hero"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-hero hover:text-hero md:bg-transparent md:hover:bg-neutral-50"
              )}
            >
              <span>
                {option.name}
                {showValue && option.value && <span className="ml-1 text-xs opacity-70">({option.value})</span>}
              </span>
              {active && <Check className="hidden h-4 w-4 md:block" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
