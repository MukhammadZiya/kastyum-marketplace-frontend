import { LogOut } from "lucide-react";
import { Button } from "@repo/ui";
import { useT } from "../../i18n";
import { logoutSeller } from "../../lib/logoutSeller";

export function SellerSidebarHeader() {
  const t = useT();
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00966d] text-sm font-bold text-white shadow-sm shadow-[#00966d]/30">
        S
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {t("common.sellerBrandName")}
        </p>
        <p className="text-sm font-semibold text-slate-900">
          {t("common.sellerBrandTitle")}
        </p>
      </div>
    </div>
  );
}

export function SellerSidebarFooter() {
  const t = useT();
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00966d]/15 text-sm font-semibold text-[#006b4d]"
        aria-hidden
      >
        SE
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">
          {t("common.sellerProfileNick")}
        </p>
        <p className="truncate text-xs text-slate-500">
          {t("common.sellerProfileRole")}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="!h-9 !w-9 shrink-0 !p-0 text-slate-500 hover:text-slate-900"
        onClick={logoutSeller}
        aria-label={t("common.sellerAriaLogOut")}
      >
        <LogOut className="h-4 w-4" strokeWidth={2} />
      </Button>
    </div>
  );
}
