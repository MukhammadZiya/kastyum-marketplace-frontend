import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateOrderStatusBody } from "@repo/types";
import { postOrderUpdateStatus } from "@repo/api";
import { sellerOrderKeys } from "./sellerOrder.keys";

export function useSellerOrderUpdateStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      body,
    }: {
      orderId: string;
      body: UpdateOrderStatusBody;
    }) => postOrderUpdateStatus(orderId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sellerOrderKeys.all });
    },
  });
}
