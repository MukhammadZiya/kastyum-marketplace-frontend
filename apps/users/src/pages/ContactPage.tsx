import Breadcrumb from "../components/Common/Breadcrumb";

export function ContactPage() {
  return (
    <>
      <Breadcrumb title="Contact" pages={["contact"]} />
      <section className="py-10 bg-neutral-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 grid xl:grid-cols-[370px_1fr] gap-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Contact Information</h2>
            <div className="space-y-3 text-neutral-700">
              <p>Name: James Septimus</p>
              <p>Phone: 1234 567890</p>
              <p>Address: 7398 Smoke Ranch Road Las Vegas, Nevada 89128</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid lg:grid-cols-2 gap-5">
                <input className="rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-5" placeholder="First Name" />
                <input className="rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-5" placeholder="Last Name" />
              </div>
              <div className="grid lg:grid-cols-2 gap-5">
                <input className="rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-5" placeholder="Subject" />
                <input className="rounded-md border border-neutral-200 bg-neutral-50 py-2.5 px-5" placeholder="Phone" />
              </div>
              <textarea rows={6} className="w-full rounded-md border border-neutral-200 bg-neutral-50 p-5" placeholder="Type your message" />
              <button type="submit" className="px-7 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

