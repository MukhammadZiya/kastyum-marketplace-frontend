import type { QueryClient } from "@tanstack/react-query";
import type { Member } from "@repo/types";
import { setAuthToken } from "@repo/api";
import { memberKeys } from "../hooks/members/member.keys";
import { SELLER_SESSION_QUERY_KEY } from "./sessionKey";

/** Forget login: browser token + cached “me” data for this app. */
export function clearSellerSession(queryClient: QueryClient): void {
  setAuthToken(null);
  queryClient.removeQueries({ queryKey: SELLER_SESSION_QUERY_KEY });
}

/**
 * After a successful login or signup: save token and put the member in cache
 * so the dashboard and React Query both see the same user immediately.
 */
export function writeSellerSessionToCache(
  queryClient: QueryClient,
  accessToken: string,
  member: Member,
): void {
  setAuthToken(accessToken);
  queryClient.setQueryData(memberKeys.me(), member);
  queryClient.setQueryData(SELLER_SESSION_QUERY_KEY, member);
  queryClient.invalidateQueries({ queryKey: memberKeys.all });
}
