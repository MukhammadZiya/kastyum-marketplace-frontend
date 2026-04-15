import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProductBody } from "@repo/types";
import { postProductCreate } from "@repo/api";
import { sellerProductKeys } from "./sellerProduct.keys";

export type CreateProductVariables = {
  body: CreateProductBody;
  /** 1–5 images → `uploads/products/` on the server. */
  images: File[];
};

export function useSellerProductCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, images }: CreateProductVariables) =>
      postProductCreate(body, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerProductKeys.all });
    },
  });
}
