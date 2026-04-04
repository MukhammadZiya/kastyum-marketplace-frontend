export type Locale = "en" | "ru" | "uz";

export const defaultLocale: Locale = "uz";

export type FlatMessages = Record<string, string>;

export type I18nState = {
  locale: Locale;
  messages: FlatMessages;
};

export type I18nActions = {
  setLocale: (locale: Locale) => void;
};

export type TranslateFn = (key: string) => string;
