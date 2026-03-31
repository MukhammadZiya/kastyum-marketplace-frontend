import { LogOut } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button, PageLayout, Sidebar, type SidebarNavItem } from "@repo/ui";
import { ADMIN_NAV_ITEMS } from "../constants/adminNavigation";
import { logoutAdmin } from "../lib/logoutAdmin";

const sidebarItems: SidebarNavItem[] = ADMIN_NAV_ITEMS.map((n) => ({
  id: n.id,
  label: n.label,
  to: n.path,
}));

function AdminBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
        K
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Kastyum
        </p>
        <p className="text-sm font-semibold text-slate-900">Admin</p>
      </div>
    </div>
  );
}

function AdminSidebarProfile({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800"
        aria-hidden
      >
        SA
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">superadmin</p>
        <p className="truncate text-xs text-slate-500">Administrator</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="!h-9 !w-9 shrink-0 !p-0 text-slate-500 hover:text-slate-900"
        onClick={onLogout}
        aria-label="Log out"
      >
        <LogOut className="h-4 w-4" strokeWidth={2} />
      </Button>
    </div>
  );
}

export function AdminAppShell() {
  const { pathname } = useLocation();

  const isItemActive = (item: SidebarNavItem) => {
    if (item.to === "/") return pathname === "/";
    return pathname === item.to || pathname.startsWith(`${item.to}/`);
  };

  const handleLogout = () => {
    logoutAdmin();
  };

  return (
    <PageLayout
      sidebar={
        <Sidebar
          brand={<AdminBrand />}
          items={sidebarItems}
          isItemActive={isItemActive}
          renderLink={({ to, className, children }) => (
            <NavLink to={to} className={className} end={to === "/"}>
              {children}
            </NavLink>
          )}
          footer={<AdminSidebarProfile onLogout={handleLogout} />}
        />
      }
    >
      <div className="px-6 pb-10 pt-6 lg:px-8">
        <Outlet />
      </div>
    </PageLayout>
  );
}
