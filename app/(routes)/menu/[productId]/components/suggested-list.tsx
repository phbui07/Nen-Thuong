"use client";

import PopularContent from "@/components/popular-content";
import { useLanguage } from "@/providers/language-provider";
import { Products } from "@/types-db";

interface SuggestedListProps {
  products: Products[];
}

export default function SuggestedList({ products }: SuggestedListProps) {
  const { t } = useLanguage();
  return (
    <section className="mt-16 md:mt-20">
      <h2 className="text-2xl font-bold text-neutral-800 md:text-3xl">{t.product.related}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {products.map((item) => (
          <PopularContent key={item.id} data={item} />
        ))}
      </div>
    </section>
  );
}
