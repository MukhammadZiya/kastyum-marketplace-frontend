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
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_60px_-46px_rgba(15,23,42,0.7)]">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E11D48] text-base font-black text-white shadow-[0_16px_30px_-18px_rgba(225,29,72,0.9)]"
          aria-hidden
        >
          iB
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#BE123C]">
            {t("common.sellerTopYourStorefront")}
          </p>
          <h2 className="truncate text-xl font-black tracking-tight text-slate-950">
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
          className="gap-1.5 rounded-xl text-slate-600 hover:bg-[#FFF1F2] hover:text-[#BE123C]"
          onClick={() => {
            logoutSeller(queryClient);
            navigate("/signin", { replace: true });
          }}
        >
          <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden />
          {t("common.sellerTopLogOut")}
        </Button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF1F2] px-3 py-1 text-xs font-black text-[#BE123C] ring-1 ring-[#E11D48]/15">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" aria-hidden />
          {t("common.sellerTopStoreLive")}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          {t("common.sellerTopSellerPanel")}
        </span>
      </div>
    </header>
  );
}
