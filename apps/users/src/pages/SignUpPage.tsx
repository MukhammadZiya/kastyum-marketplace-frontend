import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useMemberGoogleLogin } from "../hooks/members";
import { TelegramIconButton } from "../components/Auth/TelegramLoginButton";
import { GoogleLoginButton } from "../components/Auth/GoogleLoginButton";
import { getSellerSignupUrl } from "../lib/sellerAppUrl";
import { useT } from "../i18n";

export function SignUpPage() {
  const t = useT();
  const navigate = useNavigate();
  const googleLogin = useMemberGoogleLogin();
  const [formError, setFormError] = useState("");

  const openSellerSignup = () => {
    window.open(getSellerSignupUrl(), "_blank", "noopener,noreferrer");
  };

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
            <p className="mb-8 text-center text-neutral-600">
              Buyers create and enter their iBerry account with Telegram.
            </p>

            {formError ? (
              <p className="mb-5 text-sm text-red-600" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="rounded-3xl border border-[#E11D48]/15 bg-[#FFF1F4] p-5 text-center">
              <p className="mb-4 text-sm font-semibold text-[#9F1239]">
                One secure Telegram login creates your buyer account automatically.
              </p>
              <div className="flex items-center justify-center gap-4">
                <TelegramIconButton />
                <GoogleLoginButton
                  onSuccess={(accessToken) => {
                    setFormError("");
                    googleLogin.mutate({ accessToken }, {
                      onSuccess: () => navigate("/"),
                      onError: (err) => {
                        setFormError(
                          err instanceof Error ? err.message : "Google login failed",
                        );
                      },
                    });
                  }}
                  onError={() => setFormError("Google login failed. Please try again.")}
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-4 py-3 text-center text-sm text-neutral-600">
              <p className="mb-2">Selling on iBerry?</p>
              <button
                type="button"
                className="font-black text-[#BE123C] hover:underline"
                onClick={openSellerSignup}
              >
                Open seller application
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
