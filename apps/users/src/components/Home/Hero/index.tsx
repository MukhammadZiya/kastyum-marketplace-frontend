import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import { getNavMenuItems } from "../../Header/menuData";
import { useT } from "../../../i18n";

export default function Hero() {
  const t = useT();
  const menuItems = getNavMenuItems(t);

  return (
    <section className="overflow-hidden bg-[#F5F7FB] pb-8 pt-4 sm:pb-10 lg:pb-12">
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-stretch">
          <aside className="hidden overflow-hidden rounded-[1.15rem] border border-neutral-200 bg-white shadow-[0_18px_55px_-44px_rgba(15,23,42,0.55)] lg:block">
            <Link
              to="/shop-with-sidebar"
              className="flex h-14 items-center justify-center bg-[#E11D48] px-5 text-base font-black text-white transition hover:bg-[#BE123C]"
            >
              {t("common.shopNow")}
            </Link>
            <nav aria-label={t("shopFilterCategory")}>
              <ul className="divide-y divide-neutral-100">
                {menuItems.map((menuItem) => (
                  <li key={menuItem.id}>
                    <Link
                      to={menuItem.path}
                      className="flex min-h-12 items-center justify-between gap-3 px-4 py-3 text-[14px] font-semibold leading-snug text-neutral-800 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
                    >
                      <span className="min-w-0">{menuItem.title}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:hidden">
            {menuItems.map((menuItem) => (
              <Link
                key={menuItem.id}
                to={menuItem.path}
                className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-800 shadow-sm transition hover:border-[#E11D48]/30 hover:bg-[#FFF1F2] hover:text-[#BE123C]"
              >
                {menuItem.title}
              </Link>
            ))}
          </div>

          <HeroCarousel />
        </div>
      </div>

      <HeroFeature />
    </section>
  );
}
