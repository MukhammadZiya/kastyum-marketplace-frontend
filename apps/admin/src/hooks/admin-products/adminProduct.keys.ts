import type { ProductsQueryParams } from "@repo/types";

export const adminProductKeys = {
  all: ["admin-product"] as const,
  lists: () => [...adminProductKeys.all, "list"] as const,
  list: (params: ProductsQueryParams | undefined) =>
    [...adminProductKeys.lists(), params ?? {}] as const,
};
