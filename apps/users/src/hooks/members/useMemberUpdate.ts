import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberUpdateBody } from "@repo/types";
import { postMemberUpdate, setAuthToken } from "@repo/api";
import { memberKeys } from "./member.keys";

export function useMemberUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MemberUpdateBody) => postMemberUpdate(body),
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: memberKeys.me() });
    },
  });
}
