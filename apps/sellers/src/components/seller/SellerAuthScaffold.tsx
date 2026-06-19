import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { SellerSidebarHeader } from "./SellerSidebar";
import { useT } from "../../i18n";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

/**
 * Shared chrome for sign-in and sign-up: same logo as the dashboard sidebar + tab links.
 * No API logic here — only layout.
 */
export function SellerAuthScaffold({ title, subtitle, children }: Props) {
  const t = useT();

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${
      isActive ? "bg-[#FFF1F2] text-[#BE123C]" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#f6f6f7] px-4 py-8 sm:py-12">
      <div className="flex w-full max-w-[440px] flex-col">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <SellerSidebarHeader />
          <nav
            className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
            aria-label={t("common.sellerAuthNavAria")}
          >
            <NavLink to="/signin" className={tabClass}>
              {t("common.sellerAuthNavSignIn")}
            </NavLink>
            <NavLink to="/signup" className={tabClass}>
              {t("common.sellerAuthNavSignUp")}
            </NavLink>
          </nav>
        </div>

        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-center text-xl font-semibold text-slate-900">{title}</h1>
          <p className="mb-6 text-center text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
