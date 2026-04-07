import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberSignupBody } from "../../lib/marketplaceTypes";
import { postMemberSignup } from "@repo/api";
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

export function SellerSignUpPage() {
  const t = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { token, isLoading, isSuccess, data, isError } = useSellerSessionQuery();

  const [fields, setFields] = useState<MemberSignupBody>({
    nick: "",
    email: "",
    password: "",
    type: "SELLER",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  useClearSellerSessionWhenInvalid(token, { isError, isSuccess, data });

  const signup = useMutation({
    mutationFn: (body: MemberSignupBody) =>
      postMemberSignup({ ...body, type: "SELLER" }),
    onSuccess: (response) => {
      if (!accountTypeIsSeller(response.member.type)) {
        setFormError(t("common.sellerAuthErrorNotSeller"));
        return;
      }
      writeSellerSessionToCache(queryClient, response.accessToken, response.member);
      navigate("/", { replace: true });
    },
    onError: (err: unknown) => {
      setFormError(err instanceof Error ? err.message : t("common.sellerAuthErrorSignup"));
    },
  });

  if (token && isSuccess && data && accountTypeIsSeller(data.type)) {
    return <Navigate to="/" replace />;
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
      title={t("common.sellerAuthSignUpTitle")}
      subtitle={t("common.sellerAuthSignUpSubtitle")}
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setFormError("");
          if (fields.password !== confirmPassword) {
            setFormError(t("common.sellerAuthPasswordMismatch"));
            return;
          }
          signup.mutate(fields);
        }}
      >
        {formError ? (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        ) : null}

        <div>
          <label
            htmlFor="seller-signup-nick"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("common.sellerAuthNick")}
          </label>
          <input
            id="seller-signup-nick"
            autoComplete="username"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#00966d] focus:bg-white focus:ring-4 focus:ring-[#00966d]/15"
            placeholder={t("common.sellerAuthNickPh")}
            value={fields.nick}
            onChange={(e) => setFields((prev) => ({ ...prev, nick: e.target.value }))}
          />
        </div>

        <div>
          <label
            htmlFor="seller-signup-email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("common.sellerAuthEmail")}
          </label>
          <input
            id="seller-signup-email"
            type="email"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#00966d] focus:bg-white focus:ring-4 focus:ring-[#00966d]/15"
            placeholder={t("common.sellerAuthEmailPh")}
            value={fields.email}
            onChange={(e) => setFields((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <label
            htmlFor="seller-signup-password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("common.sellerAuthPassword")}
          </label>
          <input
            id="seller-signup-password"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#00966d] focus:bg-white focus:ring-4 focus:ring-[#00966d]/15"
            placeholder={t("common.sellerAuthPasswordPh")}
            value={fields.password}
            onChange={(e) => setFields((prev) => ({ ...prev, password: e.target.value }))}
          />
        </div>

        <div>
          <label
            htmlFor="seller-signup-confirm"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("common.sellerAuthConfirmPassword")}
          </label>
          <input
            id="seller-signup-confirm"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#00966d] focus:bg-white focus:ring-4 focus:ring-[#00966d]/15"
            placeholder={t("common.sellerAuthConfirmPasswordPh")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-[#00966d] hover:bg-[#007a5a]"
          disabled={signup.isPending}
        >
          {signup.isPending ? t("common.sellerAuthCreatingAccount") : t("common.sellerAuthSignUpSubmit")}
        </Button>

        <p className="text-center text-sm text-slate-600">
          {t("common.sellerAuthHasAccount")}{" "}
          <Link to="/signin" className="font-medium text-[#006b4d] hover:underline">
            {t("common.sellerAuthSignInLink")}
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
