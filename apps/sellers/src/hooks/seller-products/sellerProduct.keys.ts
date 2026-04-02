import type { ProductsQueryParams } from "@repo/types";

export const sellerProductKeys = {
  all: ["seller-product"] as const,
  lists: () => [...sellerProductKeys.all, "list"] as const,
  list: (filters: ProductsQueryParams | undefined) =>
    [...sellerProductKeys.lists(), filters ?? {}] as const,
};
