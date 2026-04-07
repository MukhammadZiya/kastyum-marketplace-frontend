import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useT } from "../i18n";
import {
  accountTypeIsSeller,
  clearSellerSession,
  useSellerSessionQuery,
} from "../seller-auth";

/**
 * Wraps every dashboard route.
 * Flow: need token → load profile → must be SELLER; otherwise send to sign-in.
 */
export function RequireSellerAuth() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { token, isLoading, isError, isSuccess, data } = useSellerSessionQuery();

  useEffect(() => {
    if (!token) {
      navigate("/signin", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    if (isError) {
      clearSellerSession(queryClient);
      navigate("/signin", { replace: true });
      return;
    }

    if (isSuccess && data && !accountTypeIsSeller(data.type)) {
      clearSellerSession(queryClient);
      navigate("/signin", { replace: true });
    }
  }, [token, isError, isSuccess, data, navigate, queryClient, location.pathname]);

  if (!token) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4">
        <p className="text-sm text-slate-500">{t("common.sellerAuthCheckingSession")}</p>
      </div>
    );
  }

  if (isError) {
    return null;
  }

  if (isSuccess && data && !accountTypeIsSeller(data.type)) {
    return null;
  }

  return <Outlet />;
}
