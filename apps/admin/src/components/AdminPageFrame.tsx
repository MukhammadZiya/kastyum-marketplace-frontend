import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Topbar } from "@repo/ui";
import { useAdminMobileNav } from "../contexts/AdminMobileNavContext";
import { useT } from "../i18n";
import { logoutAdmin } from "../lib/logoutAdmin";
import { AdminLanguageSwitcher } from "./AdminLanguageSwitcher";
import { AdminTopbarActions } from "./AdminTopbarActions";

type Props = {
  title: string;
  addon?: ReactNode;
  children: ReactNode;
};

export function AdminPageFrame({ title, addon, children }: Props) {
  const mobileNav = useAdminMobileNav();
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
              aria-label={t("common.adminAriaOpenNav")}
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          ) : null
        }
        addon={addon}
        rightSlot={
          <div className="flex shrink-0 items-center gap-2">
            <AdminLanguageSwitcher />
            <AdminTopbarActions onLogout={logoutAdmin} />
          </div>
        }
      />
      <div className="space-y-6 pt-1">{children}</div>
    </>
  );
}
