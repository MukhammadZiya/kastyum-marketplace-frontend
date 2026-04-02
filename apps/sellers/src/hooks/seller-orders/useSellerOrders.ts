import { useQuery } from "@tanstack/react-query";
import type { OrderListQuery } from "@repo/types";
import { getAuthToken, getSellerOrders } from "@repo/api";
import { sellerOrderKeys } from "./sellerOrder.keys";

export function useSellerOrders(params?: OrderListQuery) {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: sellerOrderKeys.list(params),
    queryFn: () => getSellerOrders(params),
    enabled: hasToken,
  });
}
