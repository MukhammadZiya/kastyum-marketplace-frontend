import { useQuery } from "@tanstack/react-query";
import { getMemberDetail } from "@repo/api";
import { memberKeys } from "./member.keys";

export function useMemberDetail(id: string | undefined) {
  return useQuery({
    queryKey: id ? memberKeys.detail(id) : [...memberKeys.details(), "none"],
    queryFn: () => getMemberDetail(id!),
    enabled: !!id,
  });
}
