import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Member } from "@repo/types";
import { clearSellerSession } from "./sessionCache";
import { accountTypeIsSeller } from "./sellerRules";

type SessionShape = {
  isError: boolean;
  isSuccess: boolean;
  data: Member | undefined;
};

/**
 * If the saved token is expired, or the user is not a seller, wipe the session.
 * Optional callback runs when the account exists but is the wrong role (e.g. show a message on sign-in).
 */
export function useClearSellerSessionWhenInvalid(
  token: string | null,
  session: SessionShape,
  whenWrongRole?: () => void,
) {
  const queryClient = useQueryClient();
  const whenWrongRoleRef = useRef(whenWrongRole);
  whenWrongRoleRef.current = whenWrongRole;

  useEffect(() => {
    if (!token) return;

    if (session.isError) {
      clearSellerSession(queryClient);
      return;
    }

    if (session.isSuccess && session.data && !accountTypeIsSeller(session.data.type)) {
      clearSellerSession(queryClient);
      whenWrongRoleRef.current?.();
    }
  }, [
    token,
    session.isError,
    session.isSuccess,
    session.data,
    queryClient,
  ]);
}
