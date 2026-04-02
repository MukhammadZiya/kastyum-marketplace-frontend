import type { AttributeKind } from "@repo/types";

export const attributeKeys = {
  all: ["attribute"] as const,
  lists: () => [...attributeKeys.all, "list"] as const,
  listByType: (type: AttributeKind) =>
    [...attributeKeys.lists(), type] as const,
  bundle: () => [...attributeKeys.all, "bundle"] as const,
};
