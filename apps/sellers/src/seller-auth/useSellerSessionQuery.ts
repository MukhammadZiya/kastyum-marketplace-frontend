import { useQuery } from "@tanstack/react-query";
import { getAuthToken, getMemberMe } from "@repo/api";
import { SELLER_SESSION_QUERY_KEY } from "./sessionKey";

/**
 * Fetches the current member when a token exists.
 * Does not clear bad tokens — callers handle that (sign-in page, route guard).
 */
export function useSellerSessionQuery() {
  const token = getAuthToken();

  const query = useQuery({
    queryKey: SELLER_SESSION_QUERY_KEY,
    queryFn: getMemberMe,
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60_000,
  });

  return { token, ...query };
}
