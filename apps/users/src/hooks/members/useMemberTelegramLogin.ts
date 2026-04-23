import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMemberTelegramLogin, setAuthToken } from "@repo/api";
import { memberKeys } from "./member.keys";

export function useMemberTelegramLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMemberTelegramLogin,
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.setQueryData(memberKeys.me(), data.member);
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
}
