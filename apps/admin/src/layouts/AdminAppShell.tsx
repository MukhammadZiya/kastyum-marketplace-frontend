import { useCallback, useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button, PageLayout, Sidebar, type SidebarNavItem } from "@repo/ui";
import { logoutAdmin } from "../lib/logoutAdmin";
import { ADMIN_SIDEBAR_ITEMS, isSidebarSubActive } from "./adminSidebarNav";

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

function isParentRouteActive(pathname: string, item: SidebarNavItem) {
  if (item.to === "/") return pathname === "/";
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export function AdminAppShell() {
  const { pathname } = useLocation();
  /** Explicit open/close; omitted key => follow route (open when parent route active). */
  const [sectionOverride, setSectionOverride] = useState<
    Record<string, boolean | undefined>
  >({});

  const isItemActive = (item: SidebarNavItem) => {
    if (item.to === "/") return pathname === "/";
    return pathname === item.to || pathname.startsWith(`${item.to}/`);
  };

  const isSectionExpanded = useCallback(
    (id: string) => {
      const item = ADMIN_SIDEBAR_ITEMS.find((i) => i.id === id);
      if (!item?.subItems?.length) return false;
      const auto = isParentRouteActive(pathname, item);
      const o = sectionOverride[id];
      if (o === true) return true;
      if (o === false) return false;
      return auto;
    },
    [pathname, sectionOverride],
  );

  const toggleSection = useCallback(
    (id: string) => {
      setSectionOverride((prev) => {
        const item = ADMIN_SIDEBAR_ITEMS.find((i) => i.id === id);
        const auto =
          item && item.subItems?.length
            ? isParentRouteActive(pathname, item)
            : false;
        const o = prev[id];
        const effective = o === true ? true : o === false ? false : auto;
        return { ...prev, [id]: !effective };
      });
    },
    [pathname],
  );

  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    const prevPath = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    setSectionOverride((prevMap) => {
      const next = { ...prevMap };
      let changed = false;
      for (const item of ADMIN_SIDEBAR_ITEMS) {
        if (!item.subItems?.length) continue;
        const inNow = isParentRouteActive(pathname, item);
        const wasIn = isParentRouteActive(prevPath, item);
        if (inNow && !wasIn && next[item.id] !== undefined) {
          delete next[item.id];
          changed = true;
        }
      }
      return changed ? next : prevMap;
    });
  }, [pathname]);

  const handleLogout = () => {
    logoutAdmin();
  };

  return (
    <PageLayout
      sidebar={
        <Sidebar
          brand={<AdminBrand />}
          items={ADMIN_SIDEBAR_ITEMS}
          isItemActive={isItemActive}
          isSubItemActive={(sub) => isSidebarSubActive(pathname, sub)}
          isSectionExpanded={isSectionExpanded}
          onToggleSection={toggleSection}
          renderLink={({ to, className, children, end, onClick }) => (
            <NavLink to={to} className={className} end={!!end} onClick={onClick}>
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
