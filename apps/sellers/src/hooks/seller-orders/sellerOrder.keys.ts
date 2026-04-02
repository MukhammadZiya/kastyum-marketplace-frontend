import type { OrderListQuery } from "@repo/types";

export const sellerOrderKeys = {
  all: ["seller-order"] as const,
  lists: () => [...sellerOrderKeys.all, "list"] as const,
  list: (filters: OrderListQuery | undefined) =>
    [...sellerOrderKeys.lists(), filters ?? {}] as const,
};
