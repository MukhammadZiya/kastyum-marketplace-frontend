import { useQuery } from "@tanstack/react-query";
import type { OrderListQuery } from "@repo/types";
import { getAdminOrderList, getAuthToken } from "@repo/api";
import { adminOrderKeys } from "./adminOrder.keys";

export function useAdminOrderList(params?: OrderListQuery) {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: adminOrderKeys.list(params),
    queryFn: () => getAdminOrderList(params),
    enabled: hasToken,
  });
}
