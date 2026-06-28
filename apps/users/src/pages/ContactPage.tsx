import Breadcrumb from "../components/Common/Breadcrumb";
import { useT } from "../i18n";

export function ContactPage() {
  const t = useT();
  return (
    <>
      <Breadcrumb title={t("contactPageTitle")} pages={["contact"]} />
      <section className="bg-[#FAFAFB] py-8 sm:py-10">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 sm:px-8 xl:grid-cols-[370px_1fr] xl:px-0">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_18px_70px_-58px_rgba(15,23,42,0.55)]">
            <p className="mb-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#BE123C]">
              iBerry
            </p>
            <h2 className="mb-5 text-2xl font-black tracking-tight text-neutral-950">
              {t("contactInformation")}
            </h2>
            <div className="space-y-3 text-sm font-bold text-neutral-700">
              <p>Name: James Septimus</p>
              <p>Phone: 1234 567890</p>
              <p>Address: 7398 Smoke Ranch Road Las Vegas, Nevada 89128</p>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_18px_70px_-58px_rgba(15,23,42,0.55)]">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 lg:grid-cols-2">
                <input className="rounded-xl border border-neutral-200 bg-[#FAFAFB] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/10" placeholder={t("common.firstName")} />
                <input className="rounded-xl border border-neutral-200 bg-[#FAFAFB] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/10" placeholder={t("common.lastName")} />
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                <input className="rounded-xl border border-neutral-200 bg-[#FAFAFB] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/10" placeholder={t("common.subject")} />
                <input className="rounded-xl border border-neutral-200 bg-[#FAFAFB] px-5 py-3 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/10" placeholder={t("common.phone")} />
              </div>
              <textarea rows={6} className="w-full rounded-xl border border-neutral-200 bg-[#FAFAFB] p-5 font-semibold outline-none transition focus:border-[#E11D48] focus:bg-white focus:ring-4 focus:ring-[#E11D48]/10" placeholder={t("contactPlaceholderMessage")} />
              <button type="submit" className="rounded-xl bg-[#E11D48] px-7 py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C]">
                {t("common.sendMessage")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
