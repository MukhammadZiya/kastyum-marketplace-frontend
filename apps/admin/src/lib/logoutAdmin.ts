import type { QueryClient } from "@tanstack/react-query";
import { setAuthToken } from "@repo/api";
import { adminSessionKeys } from "../hooks/admin-session";

export function logoutAdmin(queryClient: QueryClient): void {
  setAuthToken(null);
  queryClient.removeQueries({ queryKey: adminSessionKeys.me() });
}
