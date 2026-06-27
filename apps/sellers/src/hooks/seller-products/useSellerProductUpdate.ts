import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateProductBody } from "@repo/types";
import { postSellerProductUpdate } from "@repo/api";
import { sellerProductKeys } from "./sellerProduct.keys";

export type UpdateProductVariables = {
  id: string;
  body: Partial<CreateProductBody>;
  images?: File[];
};

export function useSellerProductUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body, images }: UpdateProductVariables) =>
      postSellerProductUpdate(id, body, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerProductKeys.all });
    },
  });
}
