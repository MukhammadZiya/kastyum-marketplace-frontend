import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useMemberLogin, useMemberTelegramLogin } from "../hooks/members";
import type { MemberLoginBody } from "../lib/marketplaceTypes";
import { getSellerSignInUrl } from "../lib/sellerAppUrl";
import { TelegramLoginButton } from "../components/Auth/TelegramLoginButton";
import { useT } from "../i18n";

export function SignInPage() {
  const t = useT();
  const navigate = useNavigate();
  const login = useMemberLogin();
  const telegramLogin = useMemberTelegramLogin();
  const [values, setValues] = useState<MemberLoginBody>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  return (
    <>
      <Breadcrumb title={t("signInBreadcrumb")} pages={["account", "sign in"]} />
      <section className="bg-[#F7F7F8] py-8 sm:py-10">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mx-auto max-w-[570px] rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_22px_80px_-62px_rgba(15,23,42,0.75)] sm:p-10">
            <p className="mb-2 text-center text-[12px] font-black uppercase tracking-[0.16em] text-[#BE123C]">
              iBerry
            </p>
            <h2 className="mb-2 text-center text-2xl font-black tracking-tight text-neutral-950">
              {t("signInHeading")}
            </h2>
            <p className="mb-8 text-center text-neutral-600">{t("signInSubtext")}</p>
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setFormError("");
                login.mutate(values, {
                  onSuccess: () => navigate("/"),
                  onError: (err) => {
                    setFormError(
                      err instanceof Error ? err.message : "Request failed",
                    );
                  },
                });
              }}
            >
              {formError ? (
                <p className="text-sm text-red-600" role="alert">
                  {formError}
                </p>
              ) : null}
              <div>
                <label className="mb-2 block font-bold">{t("common.email")}</label>
                <input
                  className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white"
                  placeholder={t("signInEmailPlaceholder")}
                  value={values.email}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block font-bold">{t("common.password")}</label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white"
                  placeholder={t("common.password")}
                  value={values.password}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, password: e.target.value }))
                  }
                />
              </div>
              <button
                className="w-full rounded-2xl bg-[#E11D48] py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:translate-y-0 disabled:opacity-60"
                type="submit"
                disabled={login.isPending}
              >
                {login.isPending ? `${t("common.signIn")}…` : t("common.signIn")}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-neutral-500">Or continue with</span>
                </div>
              </div>

              <TelegramLoginButton
                botName={import.meta.env.VITE_TELEGRAM_BOT_NAME || "kastyum_bot"}
                onAuth={(user) => {
                  setFormError("");
                  telegramLogin.mutate(user, {
                    onSuccess: () => navigate("/"),
                    onError: (err) => {
                      setFormError(
                        err instanceof Error ? err.message : "Telegram login failed",
                      );
                    },
                  });
                }}
              />

              <div className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 text-center text-sm text-neutral-600">
                <p className="mb-2">Selling on Kastyum?</p>
                <button
                  type="button"
                  className="font-black text-[#BE123C] hover:underline"
                  onClick={() =>
                    window.open(getSellerSignInUrl(), "_blank", "noopener,noreferrer")
                  }
                >
                  Open seller sign-in (new tab)
                </button>
              </div>
              <p className="text-center text-sm">
                Don&apos;t have an account?
                <Link to="/signup" className="pl-2 font-black text-[#BE123C]">
                  Sign Up Now!
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
