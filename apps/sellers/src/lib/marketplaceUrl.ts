/** Main marketplace (buyers) app — for “back to shopping” links. */
export function getMarketplaceOrigin(): string {
  const raw = import.meta.env.VITE_MARKETPLACE_ORIGIN as string | undefined;
  const trimmed = raw?.replace(/\/$/, "").trim();
  return trimmed || "http://localhost:5173";
}
