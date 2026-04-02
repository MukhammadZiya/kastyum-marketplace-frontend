import { useQuery } from "@tanstack/react-query";
import type { OrderListQuery } from "@repo/types";
import { getAuthToken, getMyOrders } from "@repo/api";
import { orderKeys } from "./order.keys";

export function useMyOrders(params?: OrderListQuery) {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: orderKeys.myList(params),
    queryFn: () => getMyOrders(params),
    enabled: hasToken,
  });
}
