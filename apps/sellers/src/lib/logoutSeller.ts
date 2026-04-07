import type { QueryClient } from "@tanstack/react-query";
import { clearSellerSession } from "../seller-auth/sessionCache";

/** Sign out from the seller app (same as a failed session cleanup). */
export function logoutSeller(queryClient: QueryClient): void {
  clearSellerSession(queryClient);
}
