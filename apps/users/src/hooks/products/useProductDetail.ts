import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "@repo/api";
import { productKeys } from "./product.keys";

export function useProductDetail(id: string | undefined) {
  return useQuery({
    queryKey: id ? productKeys.detail(id) : [...productKeys.details(), "none"],
    queryFn: () => getProductDetail(id!),
    enabled: !!id,
  });
}
