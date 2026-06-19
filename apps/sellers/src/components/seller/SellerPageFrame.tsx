import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Topbar } from "@repo/ui";
import { useSellerMobileNav } from "../../contexts/SellerMobileNavContext";
import { useT } from "../../i18n";

type Props = {
  title: string;
  addon?: ReactNode;
  children: ReactNode;
};

export function SellerPageFrame({ title, addon, children }: Props) {
  const mobileNav = useSellerMobileNav();
  const t = useT();

  return (
    <>
      <Topbar
        title={title}
        leadingSlot={
          mobileNav ? (
            <button
              type="button"
              onClick={mobileNav.openMobileNav}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden"
              aria-label={t("common.sellerAriaOpenNav")}
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          ) : null
        }
        addon={addon}
        className="mb-6 rounded-3xl border border-neutral-200 bg-white px-5 shadow-[0_18px_60px_-50px_rgba(15,23,42,0.75)] backdrop-blur-sm supports-[backdrop-filter]:bg-white/90"
      />
      <div className="space-y-6">{children}</div>
    </>
  );
}
