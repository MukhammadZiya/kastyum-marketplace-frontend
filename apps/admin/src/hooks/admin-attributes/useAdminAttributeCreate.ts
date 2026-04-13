import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AttributeKind, CreateAttributeBody } from "@repo/types";
import { postAdminAttributeCreate } from "@repo/api";

export const adminAttributesBundleQueryKey = ["admin", "attributes", "bundle"] as const;

export function useAdminAttributeCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { kind: AttributeKind; body: CreateAttributeBody }) =>
      postAdminAttributeCreate(args.kind, args.body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminAttributesBundleQueryKey });
    },
  });
}
