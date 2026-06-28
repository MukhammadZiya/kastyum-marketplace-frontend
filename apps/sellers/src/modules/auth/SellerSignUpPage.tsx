import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { SellerApplicationBody } from "@repo/types";
import { formatRequestFailureMessage, postSellerApplication } from "@repo/api";
import { Button } from "@repo/ui";
import { SellerAuthScaffold } from "../../components/seller/SellerAuthScaffold";
import { useT } from "../../i18n";
import { getMarketplaceOrigin } from "../../lib/marketplaceUrl";
import {
  accountTypeIsSeller,
  useClearSellerSessionWhenInvalid,
  useSellerSessionQuery,
} from "../../seller-auth";

export function SellerSignUpPage() {
  const t = useT();

  const { token, isLoading, isSuccess, data, isError } = useSellerSessionQuery();

  const [fields, setFields] = useState<SellerApplicationBody>({
    nick: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");

  useClearSellerSessionWhenInvalid(token, { isError, isSuccess, data });

  const signup = useMutation({
    mutationFn: postSellerApplication,
    onSuccess: (response) => {
      setApplicationMessage(response.message || t("common.sellerAuthApplicationSuccess"));
      setFields({ nick: "", email: "", password: "", phone: "" });
      setConfirmPassword("");
    },
    onError: (err: unknown) => {
      setFormError(formatRequestFailureMessage(err));
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
          setApplicationMessage("");
          if (!fields.nick.trim()) {
            setFormError("Enter a store or display name.");
            return;
          }
          const email = fields.email.trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFormError("Enter a valid email (e.g. you@store.com).");
            return;
          }
          const pwd = fields.password ?? "";
          if (pwd.length < 6) {
            setFormError("Password must be at least 6 characters.");
            return;
          }
          if (pwd !== confirmPassword) {
            setFormError(t("common.sellerAuthPasswordMismatch"));
            return;
          }
          signup.mutate({ ...fields, email, nick: fields.nick.trim(), phone: fields.phone?.trim() });
        }}
      >
        {applicationMessage ? (
          <div className="rounded-2xl border border-[#E11D48]/15 bg-[#FFF1F4] px-4 py-4 text-sm font-semibold text-[#9F1239]" role="status">
            <p className="font-black">{t("common.sellerAuthApplicationReceived")}</p>
            <p className="mt-1 font-medium">{applicationMessage}</p>
          </div>
        ) : null}

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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/15"
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/15"
            placeholder={t("common.sellerAuthEmailPh")}
            value={fields.email}
            onChange={(e) => setFields((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <label
            htmlFor="seller-signup-phone"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            {t("common.sellerAuthPhone")}
          </label>
          <input
            id="seller-signup-phone"
            autoComplete="tel"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/15"
            placeholder={t("common.sellerAuthPhonePh")}
            type="tel"
            inputMode="numeric"
            value={fields.phone ?? ""}
            onChange={(e) => setFields((prev) => ({ ...prev, phone: e.target.value.replace(/[^\d+]/g, "") }))}
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/15"
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/15"
            placeholder={t("common.sellerAuthConfirmPasswordPh")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-[#E11D48] hover:bg-[#BE123C]"
          disabled={signup.isPending}
        >
          {signup.isPending ? t("common.sellerAuthSubmittingApplication") : t("common.sellerAuthSignUpSubmit")}
        </Button>

        <p className="text-center text-sm text-slate-600">
          {t("common.sellerAuthHasAccount")}{" "}
          <Link to="/signin" className="font-medium text-[#BE123C] hover:underline">
            {t("common.sellerAuthSignInLink")}
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
