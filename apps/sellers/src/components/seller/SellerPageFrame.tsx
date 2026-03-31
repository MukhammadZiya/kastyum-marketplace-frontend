import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Topbar } from "@repo/ui";
import { useSellerMobileNav } from "../../contexts/SellerMobileNavContext";

type Props = {
  title: string;
  addon?: ReactNode;
  children: ReactNode;
};

export function SellerPageFrame({ title, addon, children }: Props) {
  const mobileNav = useSellerMobileNav();

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
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          ) : null
        }
        addon={addon}
        className="border-b border-slate-200/90 bg-white/90 shadow-sm shadow-slate-200/30 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80"
      />
      <div className="space-y-6 pt-1">{children}</div>
    </>
  );
}
