import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminCreateProductPayload } from "@repo/types";
import { postAdminProductCreate } from "@repo/api";
import { adminProductKeys } from "./adminProduct.keys";

export type AdminCreateProductVariables = {
  payload: AdminCreateProductPayload;
  images: File[];
};

export function useAdminProductCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, images }: AdminCreateProductVariables) =>
      postAdminProductCreate(payload, images),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
    },
  });
}
