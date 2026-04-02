import { useQuery } from "@tanstack/react-query";
import type { ProductsQueryParams } from "@repo/types";
import { getProductList } from "@repo/api";
import { productKeys } from "./product.keys";

export function useProductList(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProductList(params),
  });
}
