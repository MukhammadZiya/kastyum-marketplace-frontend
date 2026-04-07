import type { QueryClient } from "@tanstack/react-query";
import { setAuthToken } from "@repo/api";
import { memberKeys } from "../hooks/members/member.keys";

/**
 * Sign out on the marketplace: drop the saved token and forget cached member data.
 * One function so the header and any future screen stay in sync.
 */
export function clearMarketplaceSession(queryClient: QueryClient): void {
  setAuthToken(null);
  queryClient.removeQueries({ queryKey: memberKeys.all });
}
