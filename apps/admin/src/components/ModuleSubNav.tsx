import { clsx } from "clsx";
import { NavLink } from "react-router-dom";

export type SubNavItem = {
  to: string;
  label: string;
  end?: boolean;
};

type Props = {
  items: readonly SubNavItem[];
};

export function ModuleSubNav({ items }: Props) {
  return (
    <nav
      className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100/90 p-1 ring-1 ring-slate-200/80"
      aria-label="Section"
    >
      {items.map((item) => (
        <NavLink
          key={item.to + item.label}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            clsx(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-blue-800 shadow-sm ring-1 ring-slate-200/80"
                : "text-slate-600 hover:bg-white/60 hover:text-slate-900",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
