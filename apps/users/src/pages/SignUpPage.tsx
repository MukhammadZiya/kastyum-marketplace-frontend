import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { formatRequestFailureMessage } from "@repo/api";
import { useMemberSignup } from "../hooks/members";
import type { MemberSignupBody } from "../lib/marketplaceTypes";
import { getSellerSignupUrl } from "../lib/sellerAppUrl";
import { useT } from "../i18n";

type Step = "choose" | "buyer-form";

function looksLikeEmail(value: string): boolean {
  const v = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function SignUpPage() {
  const t = useT();
  const navigate = useNavigate();
  const signup = useMemberSignup();
  const [step, setStep] = useState<Step>("choose");
  const [values, setValues] = useState<MemberSignupBody>({
    nick: "",
    email: "",
    password: "",
    type: "USER",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const openSellerSignup = () => {
    const url = getSellerSignupUrl();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Breadcrumb title={t("signUpBreadcrumb")} pages={["account", "register"]} />
      <section className="bg-[#F7F7F8] py-8 sm:py-10">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mx-auto max-w-[620px] rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_22px_80px_-62px_rgba(15,23,42,0.75)] sm:p-10">
            {step === "choose" ? (
              <>
                <p className="mb-2 text-center text-[12px] font-black uppercase tracking-[0.16em] text-[#BE123C]">
                  iBerry
                </p>
                <h2 className="mb-2 text-center text-2xl font-black tracking-tight text-neutral-950">
                  {t("signUpHeading")}
                </h2>
                <p className="mb-8 text-center text-neutral-600">
                  {t("signUpUseQuestion")}
                </p>
                <div className="space-y-4">
                  <button
                    type="button"
                    className="w-full rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-5 text-left transition hover:-translate-y-px hover:border-[#E11D48] hover:bg-white hover:shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]"
                    onClick={() => setStep("buyer-form")}
                  >
                    <p className="font-black text-neutral-950">{t("signUpBuyerTitle")}</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {t("signUpBuyerDesc")}
                    </p>
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-3xl border border-neutral-200 bg-[#FAFAFA] p-5 text-left transition hover:-translate-y-px hover:border-[#E11D48] hover:bg-white hover:shadow-[0_18px_50px_-42px_rgba(15,23,42,0.7)]"
                    onClick={openSellerSignup}
                  >
                    <p className="font-black text-neutral-950">{t("signUpSellerTitle")}</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {t("signUpSellerDesc")}
                    </p>
                  </button>
                </div>
                <p className="mt-8 text-center text-sm text-neutral-600">
                  {t("signUpAlreadyHaveAccount")}
                  <Link to="/signin" className="pl-2 font-black text-[#BE123C]">
                    {t("common.signIn")}
                  </Link>
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="mb-4 text-sm font-black text-[#BE123C] hover:underline"
                  onClick={() => {
                    setStep("choose");
                    setFormError("");
                  }}
                >
                  ← Back
                </button>
                <h2 className="mb-2 text-center text-2xl font-black tracking-tight text-neutral-950">
                  Create a buyer account
                </h2>
                <p className="mb-8 text-center text-neutral-600">{t("signUpSubtext")}</p>
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormError("");
                    if (!values.nick.trim()) {
                      setFormError("Please enter a nickname.");
                      return;
                    }
                    if (!looksLikeEmail(values.email)) {
                      setFormError(
                        "Please enter a real email address (example: you@mail.com). The server rejects invalid emails.",
                      );
                      return;
                    }
                    const pwd = values.password ?? "";
                    if (pwd.length < 6) {
                      setFormError("Password must be at least 6 characters (API rule).");
                      return;
                    }
                    if (pwd !== confirmPassword) {
                      setFormError("Passwords do not match.");
                      return;
                    }
                    signup.mutate(
                      { ...values, type: "USER" },
                      {
                        onSuccess: () => navigate("/"),
                        onError: (err) => {
                          setFormError(formatRequestFailureMessage(err));
                        },
                      },
                    );
                  }}
                >
                  {formError ? (
                    <p className="text-sm text-red-600" role="alert">
                      {formError}
                    </p>
                  ) : null}
                  <input
                    className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white"
                    placeholder="Nickname"
                    value={values.nick}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, nick: e.target.value }))
                    }
                  />
                  <input
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, email: e.target.value }))
                    }
                  />
                  <input
                    type="password"
                    className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white"
                    placeholder={t("common.password")}
                    value={values.password}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, password: e.target.value }))
                    }
                  />
                  <input
                    type="password"
                    className="w-full rounded-2xl border border-neutral-200 bg-[#FAFAFA] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white"
                    placeholder="Re-type your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    className="w-full rounded-2xl bg-[#E11D48] py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C] disabled:translate-y-0 disabled:opacity-60"
                    type="submit"
                    disabled={signup.isPending}
                  >
                    {signup.isPending ? `${t("signUpCreateAccount")}…` : t("signUpCreateAccount")}
                  </button>
                  <p className="text-center text-sm">
                    {t("signUpWantSellInstead")}
                    <button
                      type="button"
                      className="pl-2 font-black text-[#BE123C] hover:underline"
                      onClick={openSellerSignup}
                    >
                      {t("signUpOpenSellerSignup")}
                    </button>
                  </p>
                  <p className="text-center text-sm">
                    {t("signUpAlreadyHaveAccount")}
                    <Link to="/signin" className="pl-2 font-black text-[#BE123C]">
                      {t("common.signIn")}
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
