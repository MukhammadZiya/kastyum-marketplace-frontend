import { Link } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";

export function MailSuccessPage() {
  return (
    <>
      <Breadcrumb title="Mail Success" pages={["mail success"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl border border-neutral-200 px-4 py-20 text-center">
            <h2 className="font-bold text-blue-600 text-4xl mb-5">Successful!</h2>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-3">Your message sent successfully</h3>
            <p className="max-w-[491px] mx-auto mb-8 text-neutral-600">
              Thank you so much for your message. We check e-mail frequently and will try our best to respond to your inquiry.
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

