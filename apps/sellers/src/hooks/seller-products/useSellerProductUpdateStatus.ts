import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductStatus } from "@repo/types";
import { postProductUpdateStatus } from "@repo/api";
import { sellerProductKeys } from "./sellerProduct.keys";

export function useSellerProductUpdateStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProductStatus }) =>
      postProductUpdateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerProductKeys.all });
    },
  });
}
