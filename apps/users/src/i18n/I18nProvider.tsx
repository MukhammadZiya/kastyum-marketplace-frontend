import { useMemo, useState, type ReactNode } from "react";
import { dictionaries } from "./dictionaries";
import { I18nActionsContext, I18nStateContext } from "./contexts";
import { defaultLocale, type Locale } from "./types";

type I18nProviderProps = {
  children: ReactNode;
  defaultLocale?: Locale;
};

export function I18nProvider({
  children,
  defaultLocale: initialLocale = defaultLocale,
}: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const state = useMemo(
    () => ({
      locale,
      messages: dictionaries[locale],
    }),
    [locale],
  );

  const actions = useMemo(
    () => ({
      setLocale,
    }),
    [],
  );

  return (
    <I18nStateContext.Provider value={state}>
      <I18nActionsContext.Provider value={actions}>
        {children}
      </I18nActionsContext.Provider>
    </I18nStateContext.Provider>
  );
}
