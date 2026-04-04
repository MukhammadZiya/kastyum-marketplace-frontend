import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useMemberSignup } from "../hooks/members";
import type { MemberSignupBody } from "../lib/marketplaceTypes";

export function SignUpPage() {
  const navigate = useNavigate();
  const signup = useMemberSignup();
  const [values, setValues] = useState<MemberSignupBody>({
    nick: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  return (
    <>
      <Breadcrumb title="Create account" pages={["account", "register"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] mx-auto rounded-xl bg-white border border-neutral-200 p-6 sm:p-10">
            <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-2">Create an Account</h2>
            <p className="text-center text-neutral-600 mb-8">Enter your details below</p>
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setFormError("");
                if (values.password !== confirmPassword) {
                  setFormError("Passwords do not match.");
                  return;
                }
                signup.mutate(values, {
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
              <input
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5"
                placeholder="Nickname"
                value={values.nick}
                onChange={(e) =>
                  setValues((v) => ({ ...v, nick: e.target.value }))
                }
              />
              <input
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5"
                placeholder="Enter your email"
                value={values.email}
                onChange={(e) =>
                  setValues((v) => ({ ...v, email: e.target.value }))
                }
              />
              <input
                type="password"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5"
                placeholder="Enter your password"
                value={values.password}
                onChange={(e) =>
                  setValues((v) => ({ ...v, password: e.target.value }))
                }
              />
              <input
                type="password"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5"
                placeholder="Re-type your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="w-full py-3 rounded-lg bg-neutral-900 text-white hover:bg-blue-600 disabled:opacity-60"
                type="submit"
                disabled={signup.isPending}
              >
                {signup.isPending ? "Creating…" : "Create Account"}
              </button>
              <p className="text-center text-sm">
                Already have an account?
                <Link to="/signin" className="text-blue-600 pl-2">
                  Sign in Now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
