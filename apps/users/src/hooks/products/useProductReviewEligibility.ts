import { useQuery } from "@tanstack/react-query";
import { getAuthToken, getProductReviewEligibility } from "@repo/api";
import { productKeys } from "./product.keys";

export function useProductReviewEligibility(productId: string | undefined) {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: productId ? productKeys.reviewEligibility(productId) : [...productKeys.all, "reviews", "none", "eligibility"],
    queryFn: () => getProductReviewEligibility(productId!),
    enabled: !!productId && hasToken,
  });
}
