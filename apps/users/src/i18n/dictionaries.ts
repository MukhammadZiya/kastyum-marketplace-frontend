import type { FlatMessages, Locale } from "./types";
import { en } from "./messages/en";
import { kk } from "./messages/kk";
import { ru } from "./messages/ru";
import { uz } from "./messages/uz";

export const dictionaries: Record<Locale, FlatMessages> = {
  en,
  kk,
  ru,
  uz,
};

/** Merge active locale over English so missing ru/uz keys still show English copy. */
export function mergeLocaleMessages(locale: Locale): FlatMessages {
  if (locale === "en") return dictionaries.en;
  return { ...dictionaries.en, ...dictionaries[locale] };
}
