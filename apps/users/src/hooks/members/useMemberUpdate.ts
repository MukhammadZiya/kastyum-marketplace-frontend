import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberUpdateBody } from "@repo/types";
import { postMemberUpdate, setAuthToken } from "@repo/api";
import { memberKeys } from "./member.keys";

export type MemberUpdateVariables = {
  body: MemberUpdateBody;
  /** Optional new profile photo → `uploads/members/` on the server. */
  profileImage?: File | null;
};

export function useMemberUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, profileImage }: MemberUpdateVariables) =>
      postMemberUpdate(body, { profileImage }),
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.setQueryData(memberKeys.me(), data.member);
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
}
