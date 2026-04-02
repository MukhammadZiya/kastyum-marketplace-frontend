import { useQuery } from "@tanstack/react-query";
import type { ProductsQueryParams } from "@repo/types";
import { getAuthToken, getSellerProductList } from "@repo/api";
import { sellerProductKeys } from "./sellerProduct.keys";

export function useSellerProductList(params?: ProductsQueryParams) {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: sellerProductKeys.list(params),
    queryFn: () => getSellerProductList(params),
    enabled: hasToken,
  });
}
