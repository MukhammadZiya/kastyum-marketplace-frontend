import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateOrderStatusBody } from "@repo/types";
import { postOrderUpdateStatus } from "@repo/api";
import { sellerOrderKeys } from "./sellerOrder.keys";

type Variables = { orderId: string; body: UpdateOrderStatusBody };

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, body }: Variables) =>
      postOrderUpdateStatus(orderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.all });
    },
  });
}
