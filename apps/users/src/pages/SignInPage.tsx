import { Link } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";

export function SignInPage() {
  return (
    <>
      <Breadcrumb title="Signin" pages={["signin"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] mx-auto rounded-xl bg-white border border-neutral-200 p-6 sm:p-10">
            <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-2">
              Sign In to Your Account
            </h2>
            <p className="text-center text-neutral-600 mb-8">Enter your detail below</p>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block mb-2">Email</label>
                <input className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block mb-2">Password</label>
                <input type="password" className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-3 px-5" placeholder="Enter your password" />
              </div>
              <button className="w-full py-3 rounded-lg bg-neutral-900 text-white hover:bg-blue-600" type="submit">
                Sign in to account
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

