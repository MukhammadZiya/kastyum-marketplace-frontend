export function getSellerAppOrigin(): string {
  const raw = import.meta.env.VITE_SELLER_APP_ORIGIN as string | undefined;
  const trimmed = raw?.replace(/\/$/, "").trim();

  if (trimmed) {
    return trimmed;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/seller`;
  }

  return "/seller";
}

export function getSellerSignupUrl(): string {
  return `${getSellerAppOrigin()}/signup`;
}

export function getSellerSignInUrl(): string {
  return `${getSellerAppOrigin()}/signin`;
}
