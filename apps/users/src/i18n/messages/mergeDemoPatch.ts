import type { FlatMessages } from "../types";

export function mergeDemoPatch(
  base: FlatMessages,
  demo: Record<string, unknown>,
): FlatMessages {
  const out: FlatMessages = { ...base };
  for (const [k, v] of Object.entries(demo)) {
    if (typeof v === "string") {
      out[k] = v;
    }
  }
  return out;
}
