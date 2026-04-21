import type { OrderListQuery } from "@repo/types";

export const sellerOrderKeys = {
  all: ["seller", "orders"] as const,
  list: (params?: OrderListQuery) =>
    [...sellerOrderKeys.all, "list", params] as const,
};
