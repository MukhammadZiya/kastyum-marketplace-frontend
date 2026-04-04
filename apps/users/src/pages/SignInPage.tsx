import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useMemberLogin } from "../hooks/members";
import type { MemberLoginBody } from "../lib/marketplaceTypes";

export function SignInPage() {
  const navigate = useNavigate();
  const login = useMemberLogin();
  const [values, setValues] = useState<MemberLoginBody>({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  return (
    <>
      <Breadcrumb title="Sign in" pages={["account", "sign in"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] mx-auto rounded-xl bg-white border border-neutral-200 p-6 sm:p-10">
            <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-2">
              Sign In to Your Account
            </h2>
            <p className="text-center text-neutral-600 mb-8">Enter your details below</p>
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
                <label className="block mb-2">Email</label>
                <input
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block mb-2">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, password: e.target.value }))
                  }
                />
              </div>
              <button
                className="w-full py-3 rounded-lg bg-neutral-900 text-white hover:bg-blue-600 disabled:opacity-60"
                type="submit"
                disabled={login.isPending}
              >
                {login.isPending ? "Signing in…" : "Sign in to account"}
              </button>
              <p className="text-center text-sm">
                Don&apos;t have an account?
                <Link to="/signup" className="text-blue-600 pl-2">
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
