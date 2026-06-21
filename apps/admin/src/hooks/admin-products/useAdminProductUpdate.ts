import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdminProductUpdate } from "@repo/api";
import type { ProductStatus } from "@repo/types";
import { adminProductKeys } from "./adminProduct.keys";

export function useAdminProductUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProductStatus }) =>
      postAdminProductUpdate(id, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminProductKeys.lists() });
    },
  });
}
