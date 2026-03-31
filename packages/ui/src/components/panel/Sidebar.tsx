import { Fragment, type ReactNode } from "react";
import { clsx } from "clsx";

export type SidebarNavItem = {
  id: string;
  label: string;
  to: string;
};

type RenderLinkArgs = {
  to: string;
  className: string;
  children: ReactNode;
};

type SidebarProps = {
  brand: ReactNode;
  items: SidebarNavItem[];
  isItemActive: (item: SidebarNavItem) => boolean;
  renderLink: (args: RenderLinkArgs) => ReactNode;
  footer: ReactNode;
  className?: string;
};

export function Sidebar({
  brand,
  items,
  isItemActive,
  renderLink,
  footer,
  className,
}: SidebarProps) {
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-20 flex w-[260px] flex-col border-r border-slate-200/90 bg-white",
        className,
      )}
    >
      <div className="border-b border-slate-100 px-5 py-6">{brand}</div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = isItemActive(item);
          return (
            <Fragment key={item.id}>
              {renderLink({
                to: item.to,
                className: clsx(
                  "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ),
                children: item.label,
              })}
            </Fragment>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">{footer}</div>
    </aside>
  );
}
