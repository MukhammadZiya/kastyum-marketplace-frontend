import type { FlatMessages } from "./types";

type RawLocaleFile = {
  common: Record<string, string>;
} & Record<string, unknown>;

export function flattenLocaleMessages(raw: RawLocaleFile): FlatMessages {
  const out: FlatMessages = {};

  const common = raw.common;
  if (common && typeof common === "object") {
    for (const key of Object.keys(common)) {
      const v = common[key];
      if (typeof v === "string") {
        out[`common.${key}`] = v;
      }
    }
  }

  for (const key of Object.keys(raw)) {
    if (key === "common") continue;
    const val = raw[key];
    if (typeof val === "string") {
      out[key] = val;
    }
  }

  return out;
}
