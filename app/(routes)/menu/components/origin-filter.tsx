"use client";

import Box from "@/components/box";
import { cn } from "@/lib/utils";
import { Origin } from "@/types-db";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
interface OriginFilterProps {
  origins: Origin[];
}

export default function OriginFilter({ origins }: OriginFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = (origin: string) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    if (currentParams.origin === origin) {
      delete currentParams.origin;
    } else {
      currentParams.origin = origin;
    }
    const href = qs.stringifyUrl({
      url: "/menu",
      query: currentParams,
    });

    router.push(href);
  };

  return (
    <Box className="flex-col gap-2 border-b pb-4">
      <h2 className="text-xl font-semibold text-neutral-700">Origin</h2>
      <Box className="flex-col gap-2 mt-2">
        {origins?.map((origin) => (
          <div
            onClick={() => handleClick(origin.name)}
            key={origin.id}
            className={cn(
              "text-sm font-semibold cursor-pointer hover:text-hero/100 text-neutral-500 flex items-center gap-2",
              origin.name === searchParams.get("origin") && "text-hero"
            )}
          >
            <p>
              {origin.name} ({origin.value})
            </p>
            {origin.name === searchParams.get("origin") && (
              <Check className="w-4 h-4 text-hero" />
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
}
