"use client";

import Box from "@/components/box";
import { cn } from "@/lib/utils";
import { Size } from "@/types-db";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
interface SizeFiltersProps {
  sizes: Size[];
}

export default function SizeFilters({ sizes }: SizeFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = (size: string) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    if (currentParams.size === size) {
      delete currentParams.size;
    } else {
      currentParams.size = size;
    }
    const href = qs.stringifyUrl({
      url: "/menu",
      query: currentParams,
    });

    router.push(href);
  };

  return (
    <Box className="flex-col gap-2 border-b pb-4">
      <h2 className="text-xl font-semibold text-neutral-700">Dung Tích</h2>
      <Box className="flex-col gap-2 mt-2">
        {sizes?.map((size) => (
          <div
            onClick={() => handleClick(size.name)}
            key={size.id}
            className={cn(
              "text-sm font-semibold cursor-pointer hover:text-hero/100 text-neutral-500 flex items-center gap-2",
              size.name === searchParams.get("size") && "text-hero"
            )}
          >
            <p>
              {size.name} ({size.value})
            </p>
            {size.name === searchParams.get("size") && (
              <Check className="w-4 h-4 text-hero" />
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
}
