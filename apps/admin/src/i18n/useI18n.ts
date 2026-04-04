import { useCallback, useContext, useMemo } from "react";
import { I18nActionsContext, I18nStateContext } from "./contexts";
import type { I18nActions, I18nState, TranslateFn } from "./types";

export function useI18nState(): I18nState {
  const ctx = useContext(I18nStateContext);
  if (!ctx) {
    throw new Error("useI18nState must be used within I18nProvider");
  }
  return ctx;
}

export function useI18nActions(): I18nActions {
  const ctx = useContext(I18nActionsContext);
  if (!ctx) {
    throw new Error("useI18nActions must be used within I18nProvider");
  }
  return ctx;
}

export function useT(): TranslateFn {
  const { messages } = useI18nState();
  return useCallback(
    (key: string) => messages[key] ?? key,
    [messages],
  );
}

export function useI18n(): I18nState & I18nActions & { t: TranslateFn } {
  const state = useI18nState();
  const actions = useI18nActions();
  const t = useT();
  return useMemo(
    () => ({
      ...state,
      ...actions,
      t,
    }),
    [state, actions, t],
  );
}
