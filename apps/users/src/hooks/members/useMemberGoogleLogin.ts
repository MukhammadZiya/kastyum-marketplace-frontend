import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMemberGoogleLogin, setAuthToken } from "@repo/api";
import { memberKeys } from "./member.keys";

export function useMemberGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMemberGoogleLogin,
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.setQueryData(memberKeys.me(), data.member);
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
}
