import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMemberLogin, setAuthToken } from "@repo/api";
import { memberKeys } from "./member.keys";

export function useMemberLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMemberLogin,
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
}
