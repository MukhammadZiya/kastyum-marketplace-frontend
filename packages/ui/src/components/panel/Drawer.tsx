import type { ReactNode } from "react";
import { useEffect } from "react";
import { clsx } from "clsx";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Shown in the drawer header when `showHeader` is true */
  title?: string;
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
  /** Merged onto the sliding panel (e.g. width to match a sidebar) */
  panelClassName?: string;
  /** When false, children fill the panel (e.g. full embedded Sidebar) */
  showHeader?: boolean;
};

/**
 * Presentational overlay drawer. Parent controls open state and focus management.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  className,
  panelClassName,
  showHeader = true,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={clsx("fixed inset-0 z-[60]", className)}
      role="dialog"
      aria-modal="true"
      aria-label={showHeader ? undefined : "Navigation menu"}
      aria-labelledby={showHeader ? "panel-drawer-title" : undefined}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/25 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div
        className={clsx(
          "absolute top-0 flex h-full flex-col bg-white shadow-xl ring-1 ring-slate-200/80",
          side === "right" ? "right-0" : "left-0",
          panelClassName ?? "w-[min(20rem,92vw)]",
        )}
      >
        {showHeader === false ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-lg bg-white px-2 py-1 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/80 hover:bg-slate-50"
          >
            Close
          </button>
        ) : null}
        {showHeader ? (
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <h2
              id="panel-drawer-title"
              className="text-sm font-semibold tracking-tight text-slate-900"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            >
              Close
            </button>
          </div>
        ) : null}
        <div
          className={clsx(
            "min-h-0 flex-1 overflow-y-auto",
            showHeader === false && "flex flex-col",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
