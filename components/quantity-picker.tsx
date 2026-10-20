"use client";

import { MAX_QUANTITY } from "@/hooks/use-carts";
import { useLanguage } from "@/providers/language-provider";
import { Minus, Plus } from "lucide-react";

interface QuantityPickerProps {
  value: number;
  onChange: (value: number) => void;
}

export default function QuantityPicker({ value, onChange }: QuantityPickerProps) {
  const { t } = useLanguage();
  const buttonClass =
    "flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 hover:text-hero focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white">
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={t.product.decrease}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label={t.product.increase}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
