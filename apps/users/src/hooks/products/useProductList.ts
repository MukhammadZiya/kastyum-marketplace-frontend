import { useQuery } from "@tanstack/react-query";
import type {
  PaginatedResult,
  ProductWithRelations,
  ProductsQueryParams,
} from "@repo/types";
import { getProductList } from "@repo/api";
import { productKeys } from "./product.keys";

export function useProductList(params?: ProductsQueryParams) {
  return useQuery<PaginatedResult<ProductWithRelations>>({
    queryKey: productKeys.list(params),
    queryFn: () => getProductList(params),
  });
}
