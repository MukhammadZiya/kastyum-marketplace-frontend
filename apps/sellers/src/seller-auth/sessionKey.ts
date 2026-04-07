/**
 * React Query key for “who is logged in on the seller app”.
 * Keep this in one file so logout, login, and the route guard never drift apart.
 */
export const SELLER_SESSION_QUERY_KEY = ["sellerSession"] as const;
