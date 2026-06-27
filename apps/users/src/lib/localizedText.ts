import type { Locale } from "../i18n/types";

export function localizedText(
  i18n: Partial<Record<string, string>> | undefined,
  locale: Locale,
  fallback: string,
): string {
  if (!i18n) return fallback;
  const val = i18n[locale];
  if (val?.trim()) return val.trim();
  return fallback;
}
