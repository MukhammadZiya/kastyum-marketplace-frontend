import type { ReactNode } from "react";
import { clsx } from "clsx";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  /** Shown in the drawer header */
  title: string;
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
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
}: DrawerProps) {
  if (!open) return null;

  return (
    <div
      className={clsx("fixed inset-0 z-[60]", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-drawer-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/25 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div
        className={clsx(
          "absolute top-0 flex h-full w-[min(20rem,92vw)] flex-col bg-white shadow-xl ring-1 ring-slate-200/80",
          side === "right" ? "right-0" : "left-0",
        )}
      >
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
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
