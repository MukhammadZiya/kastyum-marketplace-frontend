import { clsx } from "clsx";
import { NavLink } from "react-router-dom";

type LinkSpec = { to: string; label: string; end?: boolean };

type Props = {
  links: readonly LinkSpec[];
};

export function SellerShortcutNav({ links }: Props) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Section shortcuts">
      {links.map((l) => (
        <NavLink
          key={l.to}
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
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
