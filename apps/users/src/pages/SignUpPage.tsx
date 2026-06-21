import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useMemberSignup, useMemberGoogleLogin } from "../hooks/members";
import { TelegramIconButton } from "../components/Auth/TelegramLoginButton";
import { GoogleLoginButton } from "../components/Auth/GoogleLoginButton";
import { getSellerSignupUrl } from "../lib/sellerAppUrl";
import { useT } from "../i18n";

export function SignUpPage() {
  const t = useT();
  const navigate = useNavigate();
  const signup = useMemberSignup();
  const googleLogin = useMemberGoogleLogin();

  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");

  const inputClass =
    "w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (password !== confirm) {
      setFormError(t("signUpPasswordMismatch"));
      return;
    }
    signup.mutate(
      { nick: nick.trim(), email: email.trim(), phone: phone.trim() || undefined, password },
      {
        onSuccess: () => navigate("/"),
        onError: (err) => setFormError(err instanceof Error ? err.message : "Xatolik yuz berdi"),
      },
    );
  }

  return (
    <>
      <Breadcrumb title={t("signUpBreadcrumb")} pages={["account", "register"]} />
      <section className="bg-[#F7F7F8] py-8 sm:py-10">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mx-auto max-w-[570px] rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_22px_80px_-62px_rgba(15,23,42,0.75)] sm:p-10">
            <p className="mb-2 text-center text-[12px] font-black uppercase tracking-[0.16em] text-[#BE123C]">
              iBerry
            </p>
            <h2 className="mb-2 text-center text-2xl font-black tracking-tight text-neutral-950">
              {t("signUpHeading")}
            </h2>
            <p className="mb-8 text-center text-neutral-600">{t("signUpSubtext")}</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {formError ? (
                <p className="text-sm text-red-600" role="alert">{formError}</p>
              ) : null}

              <div>
                <label className="mb-2 block font-bold">{t("signUpName")}</label>
                <input
                  className={inputClass}
                  placeholder={t("signUpNamePlaceholder")}
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">{t("common.email")}</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder={t("signInEmailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">{t("signUpPhone")}</label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">{t("common.password")}</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder={t("signUpPasswordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">{t("signUpConfirmPassword")}</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder={t("signUpConfirmPasswordPlaceholder")}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={signup.isPending}
                className="w-full rounded-2xl bg-[#E11D48] py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:translate-y-0 disabled:opacity-60"
              >
                {signup.isPending ? `${t("signUpSubmit")}…` : t("signUpSubmit")}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-neutral-500">{t("signUpOrContinueWith")}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <TelegramIconButton />
              <GoogleLoginButton
                onSuccess={(accessToken) => {
                  setFormError("");
                  googleLogin.mutate({ accessToken }, {
                    onSuccess: () => navigate("/"),
                    onError: (err) => setFormError(err instanceof Error ? err.message : "Google login failed"),
                  });
                }}
                onError={() => setFormError("Google login failed. Please try again.")}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 text-center text-sm text-neutral-600">
              <p className="mb-2">{t("signInWantSell")}</p>
              <button
                type="button"
                className="font-black text-[#BE123C] hover:underline"
                onClick={() => window.open(getSellerSignupUrl(), "_blank", "noopener,noreferrer")}
              >
                {t("signInOpenSellerSignup")}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-600">
              {t("signUpAlreadyHaveAccount")}
              <Link to="/signin" className="pl-2 font-black text-[#BE123C]">
                {t("common.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
