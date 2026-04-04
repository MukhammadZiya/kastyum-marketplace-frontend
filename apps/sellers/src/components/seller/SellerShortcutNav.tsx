import { clsx } from "clsx";
import { NavLink } from "react-router-dom";
import { useT } from "../../i18n";

export type SellerShortcutLinkSpec = {
  to: string;
  labelKey: string;
  end?: boolean;
};

type Props = {
  links: readonly SellerShortcutLinkSpec[];
};

export function SellerShortcutNav({ links }: Props) {
  const t = useT();
  return (
    <nav
      className="flex flex-wrap gap-2"
      aria-label={t("common.sellerAriaSectionShortcuts")}
    >
      {links.map((l) => (
        <NavLink
          key={`${l.to}-${l.labelKey}`}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            clsx(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-[#00966d]/35 bg-emerald-50 text-[#006b4d]"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white",
            )
          }
        >
          {t(l.labelKey)}
        </NavLink>
      ))}
    </nav>
  );
}
