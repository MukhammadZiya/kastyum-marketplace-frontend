import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMemberMe, getAuthToken, setAuthToken } from "@repo/api";
import { useT } from "../i18n";
import { adminSessionKeys } from "../hooks/admin-session";

export function RequireAdminAuth() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const token = getAuthToken();

  const session = useQuery({
    queryKey: adminSessionKeys.me(),
    queryFn: getMemberMe,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [token, navigate, location.pathname]);

  useEffect(() => {
    if (!token) return;
    if (session.isError) {
      setAuthToken(null);
      navigate("/login", { replace: true });
    }
  }, [token, session.isError, navigate]);

  useEffect(() => {
    if (!token) return;
    if (session.isSuccess && session.data.type !== "ADMIN") {
      setAuthToken(null);
      navigate("/login", { replace: true });
    }
  }, [token, session.isSuccess, session.data, navigate]);

  if (!token) {
    return null;
  }

  if (session.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-500">{t("common.adminLoginCheckingSession")}</p>
      </div>
    );
  }

  if (session.isError) {
    return null;
  }

  if (session.isSuccess && session.data.type !== "ADMIN") {
    return null;
  }

  return <Outlet />;
}
