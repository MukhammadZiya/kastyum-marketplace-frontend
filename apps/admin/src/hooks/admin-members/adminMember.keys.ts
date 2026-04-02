import type { MemberListQuery } from "@repo/types";

export const adminMemberKeys = {
  all: ["admin-member"] as const,
  lists: () => [...adminMemberKeys.all, "list"] as const,
  list: (params: MemberListQuery | undefined) =>
    [...adminMemberKeys.lists(), params ?? {}] as const,
};
