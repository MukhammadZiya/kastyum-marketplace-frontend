import kkRaw from "../../locales/kk/common.json";
import kkDemo from "../../locales/kk/productDemo.strings.json";
import { flattenLocaleMessages } from "../flattenMessages";
import { mergeDemoPatch } from "./mergeDemoPatch";

export const kk = mergeDemoPatch(
  flattenLocaleMessages(kkRaw),
  kkDemo as Record<string, unknown>,
);
