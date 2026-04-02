import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdminProductDelete } from "@repo/api";
import { adminProductKeys } from "./adminProduct.keys";

export function useAdminProductDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => postAdminProductDelete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
    },
  });
}
