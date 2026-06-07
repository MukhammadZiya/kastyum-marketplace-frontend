import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberLoginBody } from "../../lib/marketplaceTypes";
import { postMemberLogin, postSellerTelegramLogin } from "@repo/api";
import { Button } from "@repo/ui";
import { SellerAuthScaffold } from "../../components/seller/SellerAuthScaffold";
import { TelegramLoginButton } from "../../components/Auth/TelegramLoginButton";
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
    onError: () => {
      setFormError(t("common.sellerAuthErrorInvalidLogin"));
    },
  });

  const telegramLogin = useMutation({
    mutationFn: postSellerTelegramLogin,
    onSuccess: (response) => {
      if (!accountTypeIsSeller(response.member.type)) {
        setFormError(t("common.sellerAuthErrorNotSeller"));
        return;
      }
      writeSellerSessionToCache(queryClient, response.accessToken, response.member);
      navigate(redirectAfterLogin, { replace: true });
    },
    onError: (err) => {
      setFormError(err instanceof Error ? err.message : t("common.sellerAuthErrorInvalidLogin"));
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#00966d] focus:bg-white focus:ring-4 focus:ring-[#00966d]/15"
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#00966d] focus:bg-white focus:ring-4 focus:ring-[#00966d]/15"
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
          className="w-full bg-[#00966d] hover:bg-[#007a5a]"
          disabled={login.isPending}
        >
          {login.isPending ? t("common.sellerAuthSigningIn") : t("common.sellerAuthSignInSubmit")}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-slate-500">
              {t("common.sellerAuthContinueWith")}
            </span>
          </div>
        </div>

        <TelegramLoginButton
          botName={import.meta.env.VITE_TELEGRAM_BOT_NAME || "iBerry_marketplace_bot"}
          onAuth={(user) => {
            setFormError("");
            telegramLogin.mutate(user);
          }}
        />

        <p className="text-center text-sm text-slate-600">
          {t("common.sellerAuthNoAccount")}{" "}
          <Link to="/signup" className="font-medium text-[#006b4d] hover:underline">
            {t("common.sellerAuthCreateSellerAccount")}
          </Link>
        </p>

        <p className="border-t border-slate-100 pt-4 text-center text-sm text-slate-500">
          {t("common.sellerAuthBuyerInstead")}{" "}
          <a
            href={marketplaceSignupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#006b4d] hover:underline"
          >
            {t("common.sellerAuthOpenMarketplaceSignup")}
          </a>
        </p>
      </form>
    </SellerAuthScaffold>
  );
}
