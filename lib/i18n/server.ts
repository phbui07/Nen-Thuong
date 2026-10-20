import { cookies } from "next/headers";
import { LANGUAGE_COOKIE, defaultLanguage, dictionaries, isLanguage, type Language } from "./dictionaries";

// The visitor's language comes from a cookie set by the language toggle, so
// server-rendered pages are already in the right language on first paint.
export async function getLanguage(): Promise<Language> {
  const value = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  return isLanguage(value) ? value : defaultLanguage;
}

export async function getDictionary() {
  return dictionaries[await getLanguage()];
}
