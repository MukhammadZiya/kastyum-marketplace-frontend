import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import HeroCarousel from "./HeroCarousel";
import { getNavMenuItems } from "../../Header/menuData";
import { useT } from "../../../i18n";

export default function Hero() {
  const t = useT();
  const menuItems = getNavMenuItems(t);

  return (
    <section className="overflow-hidden bg-white pb-8 pt-4 sm:pb-10 lg:pb-12">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8 xl:px-0">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-stretch">
          <aside className="hidden overflow-hidden rounded-xl border border-[#FFE4EA] bg-white shadow-[0_18px_55px_-48px_rgba(15,23,42,0.5)] lg:block">
            <nav aria-label={t("shopFilterCategory")}>
              <ul className="divide-y divide-neutral-100">
                {menuItems.map((menuItem) => (
                  <li key={menuItem.id}>
                    <Link
                      to={menuItem.path}
                      className="flex min-h-[3.55rem] items-center justify-between gap-3 px-4 py-3 text-[15px] font-black leading-snug text-neutral-900 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
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
                className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-[#FFE4EA] bg-white px-4 text-sm font-black text-neutral-800 shadow-sm transition hover:border-[#E11D48]/30 hover:bg-[#FFF1F2] hover:text-[#BE123C]"
              >
                {menuItem.title}
              </Link>
            ))}
          </div>

          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
