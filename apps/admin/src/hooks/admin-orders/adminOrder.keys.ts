import type { OrderListQuery } from "@repo/types";

export const adminOrderKeys = {
  all: ["admin-order"] as const,
  lists: () => [...adminOrderKeys.all, "list"] as const,
  list: (params: OrderListQuery | undefined) =>
    [...adminOrderKeys.lists(), params ?? {}] as const,
};
