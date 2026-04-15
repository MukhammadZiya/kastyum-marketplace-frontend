import kkRaw from "../../locales/kk/common.json";
import enDemo from "../../locales/en/productDemo.strings.json";
import { flattenLocaleMessages } from "../flattenMessages";
import { mergeDemoPatch } from "./mergeDemoPatch";

export const kk = mergeDemoPatch(
  flattenLocaleMessages(kkRaw),
  enDemo as Record<string, unknown>,
);
