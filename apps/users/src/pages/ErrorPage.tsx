import { Link } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";

export function ErrorPage() {
  return (
    <>
      <Breadcrumb title="Error" pages={["error"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl border border-neutral-200 px-4 py-20 text-center">
            <img src="/images/404.svg" alt="404" className="mx-auto mb-8 w-1/2 sm:w-auto" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-3">Sorry, the page can&apos;t be found</h2>
            <p className="max-w-[410px] mx-auto mb-8 text-neutral-600">
              The page you were looking for appears to have been moved, deleted or does not exist.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

