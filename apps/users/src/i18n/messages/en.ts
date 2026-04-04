import enRaw from "../../locales/en/common.json";
import enDemo from "../../locales/en/productDemo.strings.json";
import { flattenLocaleMessages } from "../flattenMessages";
import { mergeDemoPatch } from "./mergeDemoPatch";

export const en = mergeDemoPatch(
  flattenLocaleMessages(enRaw),
  enDemo as Record<string, unknown>,
);
