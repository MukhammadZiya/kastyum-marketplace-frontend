import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateOrderBody } from "@repo/types";
import { postOrderCreate } from "@repo/api";
import { orderKeys } from "./order.keys";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateOrderBody) => postOrderCreate(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
