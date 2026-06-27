import { useQuery } from "@tanstack/react-query";
import { getAuthToken, getSellerProductDetail } from "@repo/api";

export function useSellerProductDetail(id: string | null) {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: ["seller-product", "detail", id],
    queryFn: () => getSellerProductDetail(id!),
    enabled: hasToken && !!id,
  });
}
