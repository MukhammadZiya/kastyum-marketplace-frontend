import type { FlatMessages, Locale } from "./types";
import { en } from "./messages/en";
import { ru } from "./messages/ru";
import { uz } from "./messages/uz";

export const dictionaries: Record<Locale, FlatMessages> = {
  en,
  ru,
  uz,
};
