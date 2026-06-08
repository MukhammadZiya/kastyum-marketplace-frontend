import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postProductReview } from "@repo/api";
import type { CreateProductReviewBody } from "@repo/types";
import { productKeys } from "./product.keys";

export function useCreateProductReview(productId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateProductReviewBody) => {
      if (!productId) {
        throw new Error("Product id is required.");
      }
      return postProductReview(productId, body);
    },
    onSuccess: () => {
      if (!productId) return;
      queryClient.invalidateQueries({ queryKey: productKeys.reviews(productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.reviewEligibility(productId) });
    },
  });
}
