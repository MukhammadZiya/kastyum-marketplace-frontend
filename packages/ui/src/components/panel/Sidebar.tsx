import {
  Fragment,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { clsx } from "clsx";

export type SidebarSubItem = {
  to: string;
  label: string;
  end?: boolean;
};

export type SidebarNavItem = {
  id: string;
  label: string;
  to: string;
  /** Shown under the parent row when this section is active (aside sub-menu). */
  subItems?: readonly SidebarSubItem[];
};

type RenderLinkArgs = {
  to: string;
  className: string;
  children: ReactNode;
  end?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
};

export type SidebarTone = "admin" | "seller";

const SIDEBAR_TONE: Record<
  SidebarTone,
  {
    parentActive: string;
    parentInactive: string;
    leafActive: string;
    leafInactive: string;
    subActive: string;
    subInactive: string;
  }
> = {
  admin: {
    parentActive: "bg-blue-50 text-blue-800",
    parentInactive: "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    leafActive: "bg-blue-50 text-blue-800",
    leafInactive: "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    subActive: "bg-white text-blue-800 shadow-sm ring-1 ring-slate-200/80",
    subInactive: "text-slate-600 hover:bg-white/60 hover:text-slate-900",
  },
  seller: {
    parentActive: "bg-[#FFF1F2] text-[#BE123C]",
    parentInactive: "text-slate-600 hover:bg-[#FFF1F2] hover:text-[#BE123C]",
    leafActive:
      "bg-[#E11D48] text-white shadow-sm shadow-[#E11D48]/25",
    leafInactive: "text-slate-600 hover:bg-[#FFF1F2] hover:text-[#BE123C]",
    subActive:
      "bg-[#E11D48] text-white shadow-sm shadow-[#E11D48]/25",
    subInactive: "text-slate-600 hover:bg-white/70 hover:text-[#BE123C]",
  },
};

type SidebarProps = {
  brand: ReactNode;
  items: SidebarNavItem[];
  isItemActive: (item: SidebarNavItem) => boolean;
  isSubItemActive?: (sub: SidebarSubItem, parent: SidebarNavItem) => boolean;
  /** When set with `onToggleSection`, children show only while expanded (collapsible aside). */
  isSectionExpanded?: (sectionId: string) => boolean;
  onToggleSection?: (sectionId: string) => void;
  renderLink: (args: RenderLinkArgs) => ReactNode;
  footer: ReactNode;
  className?: string;
  /** `embedded` = fills a parent (e.g. drawer); `fixed` = default docked aside */
  variant?: "fixed" | "embedded";
  /** Color tokens for parent / leaf / sub links */
  tone?: SidebarTone;
};

function SectionChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className={clsx("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Sidebar({
  brand,
  items,
  isItemActive,
  isSubItemActive,
  isSectionExpanded,
  onToggleSection,
  renderLink,
  footer,
  className,
  variant = "fixed",
  tone = "admin",
}: SidebarProps) {
  const t = SIDEBAR_TONE[tone];
  const collapsible =
    typeof onToggleSection === "function" &&
    typeof isSectionExpanded === "function";

  return (
    <aside
      className={clsx(
        "flex w-[260px] flex-col bg-white",
        variant === "fixed"
          ? "fixed inset-y-0 left-0 z-20 border-r border-slate-200/90"
          : "relative h-full min-h-0 w-full max-w-none border-r-0 shadow-none",
        className,
      )}
    >
      <div className="border-b border-slate-100 px-5 py-6">{brand}</div>

      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4"
        aria-label="Main"
      >
        {items.map((item) => {
          const active = isItemActive(item);
          const hasSubs = Boolean(item.subItems?.length);
          const expanded =
            collapsible && hasSubs ? isSectionExpanded!(item.id) : active;
          const showSubPanel = hasSubs && expanded;

          return (
            <div key={item.id} className="space-y-1">
              {hasSubs && collapsible ? (
                <button
                  type="button"
                  onClick={() => onToggleSection!(item.id)}
                  className={clsx(
                    "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    active ? t.parentActive : t.parentInactive,
                  )}
                  aria-expanded={expanded}
                  aria-controls={`sidebar-section-${item.id}`}
                >
                  <span>{item.label}</span>
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"
                    aria-hidden
                  >
                    <SectionChevron expanded={expanded} />
                  </span>
                </button>
              ) : (
                renderLink({
                  to: item.to,
                  end: item.to === "/",
                  className: clsx(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? t.leafActive : t.leafInactive,
                  ),
                  children: item.label,
                })
              )}

              {showSubPanel ? (
                <div
                  id={`sidebar-section-${item.id}`}
                  className="mx-0.5 rounded-xl bg-slate-100/90 p-1 ring-1 ring-slate-200/80"
                  aria-label={`${item.label} sections`}
                >
                  {item.subItems!.map((sub) => {
                    const subActive = isSubItemActive
                      ? isSubItemActive(sub, item)
                      : false;
                    return (
                      <Fragment key={sub.to + sub.label}>
                        {renderLink({
                          to: sub.to,
                          end: sub.end,
                          className: clsx(
                            "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            subActive ? t.subActive : t.subInactive,
                          ),
                          children: sub.label,
                        })}
                      </Fragment>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">{footer}</div>
    </aside>
  );
}
