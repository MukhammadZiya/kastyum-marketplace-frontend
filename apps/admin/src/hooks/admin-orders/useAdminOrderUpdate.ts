import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdminOrderUpdateStatus } from "@repo/api";
import type { OrderStatus } from "@repo/types";
import { adminOrderKeys } from "./adminOrder.keys";

export function useAdminOrderUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      postAdminOrderUpdateStatus(id, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminOrderKeys.lists() });
    },
  });
}
