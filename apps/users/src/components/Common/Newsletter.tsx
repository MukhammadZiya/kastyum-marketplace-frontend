import { primaryImageForGroup } from "../../data/lightWebpImages";

export default function Newsletter() {
  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative z-[1] overflow-hidden rounded-xl">
          <img
            src={primaryImageForGroup(7)}
            alt="background illustration"
            className="absolute -z-[1] w-full h-full left-0 top-0 rounded-xl object-cover"
            width={1170}
            height={200}
          />
          <div className="absolute -z-[1] max-w-[523px] max-h-[243px] w-full h-full right-0 top-0 bg-gradient-to-r from-blue-700/60 to-cyan-500/50" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-4 sm:px-[30px] xl:pl-[50px] xl:pr-14 py-11">
            <div className="max-w-[491px] w-full">
              <h2 className="max-w-[399px] text-white font-bold text-lg sm:text-xl xl:text-[34px] mb-3">
                New drops, restocks & private sales
              </h2>
              <p className="text-white">
                Get edits for suits, seasonal layers, and member-only tailoring offers in your inbox.
              </p>
            </div>

            <div className="max-w-[477px] w-full">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full bg-neutral-100 border border-neutral-200 outline-none rounded-md placeholder:text-neutral-500 py-3 px-5"
                  />
                  <button
                    type="submit"
                    className="inline-flex justify-center py-3 px-7 text-white bg-blue-600 font-medium rounded-md ease-out duration-200 hover:bg-blue-700"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

