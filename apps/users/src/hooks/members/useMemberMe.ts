import { useQuery } from "@tanstack/react-query";
import { getAuthToken, getMemberMe } from "@repo/api";
import { memberKeys } from "./member.keys";

export function useMemberMe() {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: memberKeys.me(),
    queryFn: getMemberMe,
    enabled: hasToken,
  });
}
