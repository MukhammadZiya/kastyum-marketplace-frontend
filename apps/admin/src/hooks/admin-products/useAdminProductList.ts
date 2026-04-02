import { useQuery } from "@tanstack/react-query";
import type { ProductsQueryParams } from "@repo/types";
import { getAdminProductList, getAuthToken } from "@repo/api";
import { adminProductKeys } from "./adminProduct.keys";

export function useAdminProductList(params?: ProductsQueryParams) {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: adminProductKeys.list(params),
    queryFn: () => getAdminProductList(params),
    enabled: hasToken,
  });
}
