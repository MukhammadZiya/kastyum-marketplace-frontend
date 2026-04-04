import { createContext } from "react";
import type { I18nActions, I18nState } from "./types";

export const I18nStateContext = createContext<I18nState | null>(null);

export const I18nActionsContext = createContext<I18nActions | null>(null);
