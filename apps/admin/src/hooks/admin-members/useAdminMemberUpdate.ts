import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdminMemberUpdate } from "@repo/api";
import type { MemberAdminUpdateBody } from "@repo/types";
import { adminMemberKeys } from "./adminMember.keys";

export function useAdminMemberUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: MemberAdminUpdateBody;
    }) => postAdminMemberUpdate(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminMemberKeys.lists() });
    },
  });
}
