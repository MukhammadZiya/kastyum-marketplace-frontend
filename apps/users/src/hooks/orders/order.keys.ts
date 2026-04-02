import type { OrderListQuery } from "@repo/types";

export const orderKeys = {
  all: ["order"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  myList: (filters: OrderListQuery | undefined) =>
    [...orderKeys.lists(), "mine", filters ?? {}] as const,
};
