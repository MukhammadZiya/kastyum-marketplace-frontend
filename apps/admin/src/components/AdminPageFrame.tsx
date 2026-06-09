import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const t = useT();

  const handleLogout = () => {
    logoutAdmin(queryClient);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Topbar
        title={title}
        leadingSlot={
          mobileNav ? (
            <button
              type="button"
              onClick={mobileNav.openMobileNav}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-slate-700 shadow-sm transition hover:border-[#FDA4AF] hover:bg-[#FFF1F2] hover:text-[#BE123C] lg:hidden"
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
            <AdminTopbarActions onLogout={handleLogout} />
          </div>
        }
      />
      <div className="space-y-6 pt-1">{children}</div>
    </>
  );
}
