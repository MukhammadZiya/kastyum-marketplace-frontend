import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberLoginBody } from "../../lib/marketplaceTypes";
import { formatRequestFailureMessage, postMemberLogin } from "@repo/api";
import { Button } from "@repo/ui";
import { SellerAuthScaffold } from "../../components/seller/SellerAuthScaffold";
import { useT } from "../../i18n";
import { getMarketplaceOrigin } from "../../lib/marketplaceUrl";
import {
  accountTypeIsSeller,
  useClearSellerSessionWhenInvalid,
  useSellerSessionQuery,
  writeSellerSessionToCache,
} from "../../seller-auth";

export function SellerSignInPage() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const redirectAfterLogin =
    (location.state as { from?: string } | null)?.from &&
      (location.state as { from?: string }).from !== "/signin"
      ? (location.state as { from?: string }).from!
      : "/";

  const { token, isLoading, isSuccess, data, isError } = useSellerSessionQuery();

  const [emailPassword, setEmailPassword] = useState<MemberLoginBody>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  useClearSellerSessionWhenInvalid(token, {
    isError,
    isSuccess,
    data,
  }, () => setFormError(t("common.sellerAuthErrorNotSeller")));

  const login = useMutation({
    mutationFn: postMemberLogin,
    onSuccess: (response) => {
      if (!accountTypeIsSeller(response.member.type)) {
        setFormError(t("common.sellerAuthErrorNotSeller"));
        return;
      }
      writeSellerSessionToCache(queryClient, response.accessToken, response.member);
      navigate(redirectAfterLogin, { replace: true });
    },
    onError: (err) => {
      setFormError(formatRequestFailureMessage(err) || t("common.sellerAuthErrorInvalidLogin"));
    },
  });

  if (token && isSuccess && data && accountTypeIsSeller(data.type)) {
    return <Navigate to={redirectAfterLogin} replace />;
  }

  if (token && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4">
        <p className="text-sm text-slate-500">{t("common.sellerAuthCheckingSession")}</p>
      </div>
    );
  }

  const marketplaceSignupUrl = `${getMarketplaceOrigin()}/signup`;

  return (
    <SellerAuthScaffold
      title={t("common.sellerAuthSignInTitle")}
      subtitle={t("common.sellerAuthSignInSubtitle")}
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setFormError("");
          login.mutate(emailPassword);
        }}
      >
        {formError ? (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        ) : null}

        <div>
          <label
            htmlFor="seller-signin-email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("common.sellerAuthEmail")}
          </label>
          <input
            id="seller-signin-email"
            type="email"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/15"
            placeholder={t("common.sellerAuthEmailPh")}
            value={emailPassword.email}
            onChange={(e) =>
              setEmailPassword((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        <div>
          <label
            htmlFor="seller-signin-password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("common.sellerAuthPassword")}
          </label>
          <input
            id="seller-signin-password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/15"
            placeholder={t("common.sellerAuthPasswordPh")}
            value={emailPassword.password}
            onChange={(e) =>
              setEmailPassword((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-[#E11D48] hover:bg-[#BE123C]"
          disabled={login.isPending}
        >
          {login.isPending ? t("common.sellerAuthSigningIn") : t("common.sellerAuthSignInSubmit")}
        </Button>

        <div className="rounded-2xl border border-[#E11D48]/15 bg-[#FFF1F4] px-4 py-3 text-sm text-[#9F1239]">
          {t("common.sellerAuthApprovalNotice")}
        </div>

        <p className="text-center text-sm text-slate-600">
          {t("common.sellerAuthNoAccount")}{" "}
          <Link to="/signup" className="font-medium text-[#BE123C] hover:underline">
            {t("common.sellerAuthCreateSellerAccount")}
          </Link>
        </p>

        <p className="border-t border-slate-100 pt-4 text-center text-sm text-slate-500">
          {t("common.sellerAuthBuyerInstead")}{" "}
          <a
            href={marketplaceSignupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#BE123C] hover:underline"
          >
            {t("common.sellerAuthOpenMarketplaceSignup")}
          </a>
        </p>
      </form>
    </SellerAuthScaffold>
  );
}
