import { useQuery } from "@tanstack/react-query";
import type { MemberListQuery } from "@repo/types";
import { getAdminMemberList, getAuthToken } from "@repo/api";
import { adminMemberKeys } from "./adminMember.keys";

export function useAdminMemberList(params?: MemberListQuery) {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: adminMemberKeys.list(params),
    queryFn: () => getAdminMemberList(params),
    enabled: hasToken,
  });
}
