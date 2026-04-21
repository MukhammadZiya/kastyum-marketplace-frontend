import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MemberLoginBody } from "@repo/types";
import {
  getAuthToken,
  getMemberMe,
  postMemberLogin,
  setAuthToken,
} from "@repo/api";
import { Button } from "@repo/ui";
import { useT } from "../../i18n";
import { adminSessionKeys } from "../../hooks/admin-session";

export function AdminLoginPage() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== "/login"
      ? (location.state as { from?: string }).from!
      : "/users/list";

  const token = getAuthToken();

  const session = useQuery({
    queryKey: adminSessionKeys.me(),
    queryFn: getMemberMe,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60_000,
  });

  const [values, setValues] = useState<MemberLoginBody>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!token) return;
    if (session.isError) {
      setAuthToken(null);
      queryClient.removeQueries({ queryKey: adminSessionKeys.me() });
    }
  }, [token, session.isError, queryClient]);

  useEffect(() => {
    if (!token) return;
    if (session.isSuccess && session.data.type !== "ADMIN") {
      setAuthToken(null);
      queryClient.removeQueries({ queryKey: adminSessionKeys.me() });
      setFormError(t("common.adminLoginErrorNotAdmin"));
    }
  }, [token, session.isSuccess, session.data, queryClient, t]);

  const login = useMutation({
    mutationFn: postMemberLogin,
    onSuccess: (data) => {
      if (data.member.type !== "ADMIN") {
        setFormError(t("common.adminLoginErrorNotAdmin"));
        return;
      }
      setAuthToken(data.accessToken);
      queryClient.setQueryData(adminSessionKeys.me(), data.member);
      navigate(from, { replace: true });
    },
    onError: () => {
      setFormError(t("common.adminLoginErrorInvalid"));
    },
  });

  if (token && session.isSuccess && session.data.type === "ADMIN") {
    return <Navigate to={from} replace />;
  }

  if (token && session.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-500">{t("common.adminLoginCheckingSession")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white">
          K
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {t("common.adminBrandName")}
          </p>
          <p className="text-lg font-semibold text-slate-900">
            {t("common.adminLoginTitle")}
          </p>
        </div>
      </div>

      <div className="w-full max-w-[400px] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-6 text-center text-sm text-slate-500">
          {t("common.adminLoginSubtitle")}
        </p>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setFormError("");
            login.mutate(values);
          }}
        >
          {formError ? (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          ) : null}

          <div>
            <label htmlFor="admin-login-email" className="mb-2 block text-sm font-medium text-slate-700">
              {t("common.adminLoginEmail")}
            </label>
            <input
              id="admin-login-email"
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-blue-600/0 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
              placeholder={t("common.adminLoginEmailPh")}
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            />
          </div>

          <div>
            <label
              htmlFor="admin-login-password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              {t("common.adminLoginPassword")}
            </label>
            <input
              id="admin-login-password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-blue-600/0 transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
              placeholder={t("common.adminLoginPasswordPh")}
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={login.isPending}
          >
            {login.isPending ? t("common.adminLoginSubmitting") : t("common.adminLoginSubmit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
