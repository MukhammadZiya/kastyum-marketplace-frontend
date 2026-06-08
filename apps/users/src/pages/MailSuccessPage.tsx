import { Link } from "react-router-dom";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useT } from "../i18n";

export function MailSuccessPage() {
  const t = useT();
  return (
    <>
      <Breadcrumb title={t("mailSuccessBreadcrumb")} pages={["contact", "thank you"]} />
      <section className="bg-[#F7F7F8] py-8 sm:py-10">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="rounded-3xl border border-neutral-200 bg-white px-4 py-20 text-center shadow-[0_22px_80px_-62px_rgba(15,23,42,0.75)]">
            <h2 className="mb-5 text-4xl font-black text-[#E11D48]">{t("mailSuccessHeading")}</h2>
            <h3 className="mb-3 text-2xl font-black tracking-tight text-neutral-950">{t("mailSuccessSubheading")}</h3>
            <p className="max-w-[491px] mx-auto mb-8 text-neutral-600">
              {t("mailSuccessBody")}
            </p>
            <Link to="/" className="inline-flex items-center gap-2 rounded-2xl bg-[#E11D48] px-6 py-3.5 font-black text-white shadow-[0_18px_40px_-22px_rgba(225,29,72,0.7)] transition hover:-translate-y-px hover:bg-[#BE123C]">
              {t("common.backToHome")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
