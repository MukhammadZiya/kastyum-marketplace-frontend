import type { Locale } from "./types";

export const LOCALE_REGION: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
  kk: "KZ",
  en: "US",
};

export function flagEmoji(iso3166Alpha2: string): string {
  const code = iso3166Alpha2.toUpperCase();
  if (code.length !== 2) return "";
  const base = 0x1f1e6;
  const a = code.charCodeAt(0);
  const b = code.charCodeAt(1);
  if (a < 65 || a > 90 || b < 65 || b > 90) return "";
  return String.fromCodePoint(base + (a - 65), base + (b - 65));
}
