import uzRaw from "../../locales/uz/common.json";
import uzDemo from "../../locales/uz/productDemo.strings.json";
import { flattenLocaleMessages } from "../flattenMessages";
import { mergeDemoPatch } from "./mergeDemoPatch";

export const uz = mergeDemoPatch(
  flattenLocaleMessages(uzRaw),
  uzDemo as Record<string, unknown>,
);
