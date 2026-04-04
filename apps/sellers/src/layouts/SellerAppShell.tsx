import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Drawer,
  PageLayout,
  Sidebar,
  type SidebarNavItem,
  type SidebarSubItem,
} from "@repo/ui";
import {
  SellerSidebarFooter,
  SellerSidebarHeader,
} from "../components/seller/SellerSidebar";
import { SellerTopbar } from "../components/seller/SellerTopbar";
import { SellerMobileNavContext } from "../contexts/SellerMobileNavContext";
import { useT } from "../i18n";
import { buildSellerSidebarItems, isSellerSubActive } from "./sellerSidebarNav";

function isParentRouteActive(pathname: string, item: SidebarNavItem) {
  if (item.to === "/") return pathname === "/";
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export function SellerAppShell() {
  const { pathname } = useLocation();
  const t = useT();
  const sidebarItems = useMemo(() => buildSellerSidebarItems(t), [t]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sectionOverride, setSectionOverride] = useState<
    Record<string, boolean | undefined>
  >({});

  const isItemActive = (item: SidebarNavItem) => {
    if (item.to === "/") return pathname === "/";
    return pathname === item.to || pathname.startsWith(`${item.to}/`);
  };

  const isSectionExpanded = useCallback(
    (id: string) => {
      const item = sidebarItems.find((i) => i.id === id);
      if (!item?.subItems?.length) return false;
      const auto = isParentRouteActive(pathname, item);
      const o = sectionOverride[id];
      if (o === true) return true;
      if (o === false) return false;
      return auto;
    },
    [pathname, sectionOverride, sidebarItems],
  );

  const toggleSection = useCallback(
    (id: string) => {
      setSectionOverride((prev) => {
        const item = sidebarItems.find((i) => i.id === id);
        const auto =
          item && item.subItems?.length
            ? isParentRouteActive(pathname, item)
            : false;
        const o = prev[id];
        const effective = o === true ? true : o === false ? false : auto;
        return { ...prev, [id]: !effective };
      });
    },
    [pathname, sidebarItems],
  );

  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    const prevPath = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    setSectionOverride((prevMap) => {
      const next = { ...prevMap };
      let changed = false;
      for (const item of sidebarItems) {
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
  }, [pathname, sidebarItems]);

  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);

  type LinkArgs = {
    to: string;
    className: string;
    children: ReactNode;
    end?: boolean;
    onClick?: MouseEventHandler<HTMLElement>;
  };

  const renderDesktopLink = useCallback(
    ({ to, className, children, end, onClick }: LinkArgs) => (
      <NavLink to={to} className={className} end={!!end} onClick={onClick}>
        {children}
      </NavLink>
    ),
    [],
  );

  const renderMobileLink = useCallback(
    ({ to, className, children, end, onClick }: LinkArgs) => (
      <NavLink
        to={to}
        className={className}
        end={!!end}
        onClick={(e) => {
          onClick?.(e);
          setMobileNavOpen(false);
        }}
      >
        {children}
      </NavLink>
    ),
    [],
  );

  const sidebarShared = {
    brand: <SellerSidebarHeader />,
    items: sidebarItems,
    isItemActive,
    isSubItemActive: (sub: SidebarSubItem) => isSellerSubActive(pathname, sub),
    isSectionExpanded,
    onToggleSection: toggleSection,
    footer: <SellerSidebarFooter />,
    tone: "seller" as const,
  };

  return (
    <SellerMobileNavContext.Provider value={{ openMobileNav }}>
      <>
        <div className="min-h-screen bg-[#f4f6f8] text-slate-900">
          <PageLayout
            className="!bg-[#f4f6f8]"
            sidebar={
              <Sidebar
                {...sidebarShared}
                variant="fixed"
                className="hidden border-slate-200/90 lg:flex"
                renderLink={renderDesktopLink}
              />
            }
          >
            <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-4 lg:px-8 lg:pt-6">
              <SellerTopbar />
              <Outlet />
            </div>
          </PageLayout>

          <Drawer
            open={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
            side="left"
            showHeader={false}
            panelClassName="w-[260px] max-w-[min(260px,92vw)] border-slate-200/90 p-0"
          >
            <Sidebar
              {...sidebarShared}
              variant="embedded"
              className="h-full min-h-0 border-0 pt-12"
              renderLink={renderMobileLink}
            />
          </Drawer>
        </div>
      </>
    </SellerMobileNavContext.Provider>
  );
}
