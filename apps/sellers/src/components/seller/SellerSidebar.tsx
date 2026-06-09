import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@repo/ui";
import { useT } from "../../i18n";
import { logoutSeller } from "../../lib/logoutSeller";

export function SellerSidebarHeader() {
  const t = useT();
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E11D48] text-sm font-black text-white shadow-[0_16px_30px_-18px_rgba(225,29,72,0.9)]">
        iB
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          iBerry
        </p>
        <p className="text-sm font-black text-slate-950">
          {t("common.sellerBrandTitle")}
        </p>
      </div>
    </div>
  );
}

export function SellerSidebarFooter() {
  const t = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#FFE4EA] bg-[#FFF1F2] p-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#BE123C] ring-1 ring-[#E11D48]/15"
        aria-hidden
      >
        SE
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-950">
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
        className="!h-9 !w-9 shrink-0 !p-0 text-slate-500 hover:bg-white hover:text-[#BE123C]"
        onClick={() => {
          logoutSeller(queryClient);
          navigate("/signin", { replace: true });
        }}
        aria-label={t("common.sellerAriaLogOut")}
      >
        <LogOut className="h-4 w-4" strokeWidth={2} />
      </Button>
    </div>
  );
}
