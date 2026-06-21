import { Link } from "react-router-dom";
import { HeartHandshake, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useT } from "../../i18n";

const footerStats = [
  { value: "24/7", labelKey: "footerStatStyleSupport" },
  { value: "30", labelKey: "footerStatReturnDays" },
  { value: "100%", labelKey: "footerStatSecureCheckout" },
  { value: "iB", labelKey: "footerStatLocalMarketplace" },
];

export default function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t border-neutral-200 bg-white sm:mt-18 xl:mt-20">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="-mt-8 grid gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_22px_90px_-64px_rgba(15,23,42,0.75)] sm:grid-cols-2 lg:grid-cols-4">
          {footerStats.map((item) => (
            <div key={item.labelKey} className="rounded-2xl bg-[#FAFAFA] px-5 py-4">
              <p className="text-2xl font-black tracking-tight text-neutral-950">
                {item.value}
              </p>
              <p className="mt-1 text-sm font-bold text-neutral-500">
                {t(item.labelKey)}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr] lg:py-16">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.png" alt="iBerry" className="h-14 w-auto object-contain" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-600">
              {t("footerLead")}
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-neutral-700">
              <a href="#" className="flex items-center gap-3 transition hover:text-[#BE123C]">
                <MapPin className="h-5 w-5 text-[#E11D48]" strokeWidth={2.1} />
                {t("footerAddressLine")}
              </a>
              <a href="#" className="flex items-center gap-3 transition hover:text-[#BE123C]">
                <Phone className="h-5 w-5 text-[#E11D48]" strokeWidth={2.1} />
                {t("footerPhoneDisplay")}
              </a>
              <a href="#" className="flex items-center gap-3 transition hover:text-[#BE123C]">
                <Mail className="h-5 w-5 text-[#E11D48]" strokeWidth={2.1} />
                {t("footerEmailDisplay")}
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 sm:justify-start">
              <a
                href="https://www.instagram.com/iberry_uz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAFA] ring-1 ring-neutral-200 transition duration-200 hover:bg-gradient-to-br hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:ring-0"
              >
                <svg className="h-5 w-5 text-neutral-600 transition duration-200 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAFA] ring-1 ring-neutral-200 transition duration-200 hover:bg-[#1877F2] hover:ring-0"
              >
                <svg className="h-5 w-5 text-neutral-600 transition duration-200 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Telegram"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAFA] ring-1 ring-neutral-200 transition duration-200 hover:bg-[#26A5E4] hover:ring-0"
              >
                <svg className="h-5 w-5 text-neutral-600 transition duration-200 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.93 3.24a1.5 1.5 0 0 0-1.54-.21L2.87 10.2a1.5 1.5 0 0 0 .09 2.78l3.77 1.26 1.55 4.9a1 1 0 0 0 1.7.4l2.23-2.27 3.91 2.87a1.5 1.5 0 0 0 2.34-1l2.5-14a1.5 1.5 0 0 0-.03-.9ZM10.5 15.5l-.9 2.7-1.1-3.5 8.5-6.8-6.5 7.6Z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-[12px] font-black uppercase tracking-[0.16em] text-neutral-400">
              {t("footerAccountTitle")}
            </h2>
            <ul className="mt-5 grid gap-3 text-sm font-bold text-neutral-700">
              <li>
                <Link className="transition hover:text-[#BE123C]" to="/my-account">
                  {t("footerLinkMyAccount")}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-[#BE123C]" to="/signin">
                  {t("footerLinkLoginRegister")}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-[#BE123C]" to="/cart">
                  {t("footerLinkCart")}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-[#BE123C]" to="/shop-with-sidebar">
                  {t("footerLinkShopCollection")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[12px] font-black uppercase tracking-[0.16em] text-neutral-400">
              {t("footerQuickLinksTitle")}
            </h2>
            <ul className="mt-5 grid gap-3 text-sm font-bold text-neutral-700">
              <li><a className="transition hover:text-[#BE123C]" href="#">{t("footerLinkPrivacy")}</a></li>
              <li><a className="transition hover:text-[#BE123C]" href="#">{t("footerLinkRefund")}</a></li>
              <li><a className="transition hover:text-[#BE123C]" href="#">{t("footerLinkTerms")}</a></li>
              <li><a className="transition hover:text-[#BE123C]" href="#">{t("footerLinkFaq")}</a></li>
              <li><a className="transition hover:text-[#BE123C]" href="#">{t("footerLinkContact")}</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-[12px] font-black uppercase tracking-[0.16em] text-neutral-400">
              {t("footerCareTitle")}
            </h2>
            <div className="mt-5 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-[#FAFAFA] p-4">
                <Truck className="h-5 w-5 text-[#E11D48]" strokeWidth={2.2} />
                <p className="text-sm font-bold text-neutral-800">{t("footerCareDelivery")}</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#FAFAFA] p-4">
                <RotateCcw className="h-5 w-5 text-[#E11D48]" strokeWidth={2.2} />
                <p className="text-sm font-bold text-neutral-800">{t("footerCareReturns")}</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#FAFAFA] p-4">
                <ShieldCheck className="h-5 w-5 text-[#E11D48]" strokeWidth={2.2} />
                <p className="text-sm font-bold text-neutral-800">{t("footerCareCheckout")}</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#FAFAFA] p-4">
                <HeartHandshake className="h-5 w-5 text-[#E11D48]" strokeWidth={2.2} />
                <p className="text-sm font-bold text-neutral-800">{t("footerCareSellerSupport")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 py-5 text-sm font-bold text-neutral-500">
          <p>&copy; {year} {t("footerCopyright")}</p>
          <p>{t("footerWeAccept")}</p>
        </div>
      </div>
    </footer>
  );
}
