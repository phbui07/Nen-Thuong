"use client";

import { LANGUAGE_COOKIE, dictionaries, type Dictionary, type Language } from "@/lib/i18n/dictionaries";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useTransition } from "react";

interface LanguageContextValue {
  language: Language;
  t: Dictionary;
  setLanguage: (language: Language) => void;
  isSwitching: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  language: Language;
  children: React.ReactNode;
}

// `language` comes from the root layout, which reads the cookie. Switching
// sets the cookie and refreshes, so server and client text change together.
export default function LanguageProvider({ language, children }: LanguageProviderProps) {
  const router = useRouter();
  const [isSwitching, startTransition] = useTransition();

  const setLanguage = useCallback(
    (next: Language) => {
      document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      startTransition(() => router.refresh());
    },
    [router]
  );

  return (
    <LanguageContext.Provider value={{ language, t: dictionaries[language], setLanguage, isSwitching }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return context;
}
