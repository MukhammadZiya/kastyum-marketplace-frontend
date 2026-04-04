import en from "./en/common.json";

export const defaultLocale = "en" as const;

export type Locale = typeof defaultLocale;

/** English messages: only `common` is nested; all other keys are flat at the root of the JSON file. */
export const messages = {
  en,
} as const;

export type Messages = (typeof messages)[Locale];
