import { useQuery } from "@tanstack/react-query";
import { getAdminMemberDetail, getAuthToken } from "@repo/api";
import { adminMemberKeys } from "./adminMember.keys";

export function useAdminMemberDetail(id: string) {
  const hasToken = !!getAuthToken();

  return useQuery({
    queryKey: adminMemberKeys.detail(id),
    queryFn: () => getAdminMemberDetail(id),
    enabled: hasToken && !!id,
  });
}
