import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@repo/ui";
import { SellerLanguageSwitcher } from "./SellerLanguageSwitcher";
import { useT } from "../../i18n";
import { logoutSeller } from "../../lib/logoutSeller";

export function SellerTopbar() {
  const t = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00966d] text-sm font-bold text-white shadow-sm shadow-[#00966d]/25"
          aria-hidden
        >
          S
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            {t("common.sellerTopYourStorefront")}
          </p>
          <h2 className="truncate text-lg font-semibold tracking-tight text-slate-900">
            {t("common.sellerTopDemoStore")}
          </h2>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <SellerLanguageSwitcher />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-slate-600 hover:text-slate-900"
          onClick={() => {
            logoutSeller(queryClient);
            navigate("/signin", { replace: true });
          }}
        >
          <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden />
          {t("common.sellerTopLogOut")}
        </Button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-[#006b4d] ring-1 ring-[#00966d]/20">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00966d]" aria-hidden />
          {t("common.sellerTopStoreLive")}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {t("common.sellerTopSellerPanel")}
        </span>
      </div>
    </header>
  );
}
