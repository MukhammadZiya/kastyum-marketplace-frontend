import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AttributeKind } from "@repo/types";
import { postAdminAttributeDelete } from "@repo/api";
import { adminAttributesBundleQueryKey } from "./useAdminAttributeCreate";

export function useAdminAttributeDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { kind: AttributeKind; id: string }) =>
      postAdminAttributeDelete(args.kind, args.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminAttributesBundleQueryKey });
    },
  });
}
