import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMemberSignup, setAuthToken } from "@repo/api";
import { memberKeys } from "./member.keys";

export function useMemberSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMemberSignup,
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
}
