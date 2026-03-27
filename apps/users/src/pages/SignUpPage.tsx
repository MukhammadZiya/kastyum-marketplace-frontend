import { Link } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";

export function SignUpPage() {
  return (
    <>
      <Breadcrumb title="Signup" pages={["signup"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] mx-auto rounded-xl bg-white border border-neutral-200 p-6 sm:p-10">
            <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-2">Create an Account</h2>
            <p className="text-center text-neutral-600 mb-8">Enter your detail below</p>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <input className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5" placeholder="Enter your full name" />
              <input className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5" placeholder="Enter your email" />
              <input type="password" className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5" placeholder="Enter your password" />
              <input type="password" className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5" placeholder="Re-type your password" />
              <button className="w-full py-3 rounded-lg bg-neutral-900 text-white hover:bg-blue-600" type="submit">
                Create Account
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

