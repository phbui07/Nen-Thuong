"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

function VietnamFlag() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden className="h-4 w-6 rounded-[3px] shadow-sm">
      <rect width="30" height="20" fill="#DA251D" />
      <polygon
        fill="#FFFF00"
        points="15,4 16.18,7.64 20,7.64 16.91,9.88 18.09,13.52 15,11.27 11.91,13.52 13.09,9.88 10,7.64 13.82,7.64"
      />
    </svg>
  );
}

function UnitedStatesFlag() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden className="h-4 w-6 rounded-[3px] shadow-sm">
      <rect width="30" height="20" fill="#FFFFFF" />
      {[0, 2, 4, 6, 8, 10, 12].map((stripe) => (
        <rect key={stripe} y={(stripe * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
      ))}
      <rect width="12" height={(7 * 20) / 13} fill="#3C3B6E" />
      {[2, 6, 10].flatMap((x) => [2.2, 5.4, 8.6].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="#FFFFFF" />))}
    </svg>
  );
}

interface LanguageToggleProps {
  className?: string;
}

// Shows the flag of the language you can switch to.
export default function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, t, setLanguage, isSwitching } = useLanguage();
  const next = language === "vi" ? "en" : "vi";

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      disabled={isSwitching}
      aria-label={t.nav.switchLanguage}
      title={t.nav.switchLanguage}
      lang={next}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:border-hero hover:text-hero focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero focus-visible:ring-offset-2 disabled:opacity-60",
        className
      )}
    >
      {next === "en" ? <UnitedStatesFlag /> : <VietnamFlag />}
      <span className="hidden sm:inline">{t.nav.otherLanguageCode}</span>
    </button>
  );
}
