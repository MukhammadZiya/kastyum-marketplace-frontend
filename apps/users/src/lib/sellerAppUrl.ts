/**
 * Base URL of the **sellers** Vite app only (no trailing slash).
 * Default matches `apps/sellers` fixed dev port — not admin (`5175`) or users (`5173`).
 * Override with `VITE_SELLER_APP_ORIGIN` in repo root `.env` if your setup differs.
 */
export function getSellerAppOrigin(): string {
  const raw = import.meta.env.VITE_SELLER_APP_ORIGIN as string | undefined;
  const trimmed = raw?.replace(/\/$/, "").trim();
  return trimmed || "http://localhost:5174";
}

export function getSellerSignupUrl(): string {
  return `${getSellerAppOrigin()}/signup`;
}

export function getSellerSignInUrl(): string {
  return `${getSellerAppOrigin()}/signin`;
}
