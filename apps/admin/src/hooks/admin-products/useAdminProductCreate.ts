import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminCreateProductPayload } from "@repo/types";
import { postAdminProductCreate } from "@repo/api";
import { adminHomeShowcaseKeys } from "../admin-home-showcase/adminHomeShowcase.keys";
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
      void queryClient.invalidateQueries({
        queryKey: adminHomeShowcaseKeys.config,
      });
    },
  });
}
