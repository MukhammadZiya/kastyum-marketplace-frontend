import ruRaw from "../../locales/ru/common.json";
import ruDemo from "../../locales/ru/productDemo.strings.json";
import { flattenLocaleMessages } from "../flattenMessages";
import { mergeDemoPatch } from "./mergeDemoPatch";

export const ru = mergeDemoPatch(
  flattenLocaleMessages(ruRaw),
  ruDemo as Record<string, unknown>,
);
