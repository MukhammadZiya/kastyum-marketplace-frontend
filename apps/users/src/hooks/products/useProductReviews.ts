import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "@repo/api";
import { productKeys } from "./product.keys";

export function useProductReviews(productId: string | undefined) {
  return useQuery({
    queryKey: productId ? productKeys.reviews(productId) : [...productKeys.all, "reviews", "none"],
    queryFn: () => getProductReviews(productId!),
    enabled: !!productId,
  });
}
