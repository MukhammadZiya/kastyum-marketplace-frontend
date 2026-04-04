type AdminListEmptyMessageParams = {
  signedIn: boolean;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  /** Shown when the user is not authenticated (e.g. admin token missing). */
  signInHint: string;
  /** Shown when the query succeeded but the list is empty. */
  whenEmpty: string;
};

/**
 * Shared copy for admin data tables: auth hint, loading, error, or empty catalog.
 * Keeps list pages as thin composition layers (see list-page pattern).
 */
export function getAdminListEmptyMessage({
  signedIn,
  isPending,
  isError,
  error,
  signInHint,
  whenEmpty,
}: AdminListEmptyMessageParams): string {
  if (!signedIn) return signInHint;
  if (isPending) return "Loading…";
  if (isError) {
    return error instanceof Error ? error.message : "Request failed.";
  }
  return whenEmpty;
}
