import type { ReactNode } from "react";
import { clsx } from "clsx";

type TopbarProps = {
  title: string;
  /** e.g. mobile menu control — shown before the title */
  leadingSlot?: ReactNode;
  /** Breadcrumb row, search field, or other secondary control */
  addon?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
};

export function Topbar({
  title,
  leadingSlot,
  addon,
  rightSlot,
  className,
}: TopbarProps) {
  return (
    <header
      className={clsx(
        "sticky top-0 z-10 border-b border-slate-200/80 bg-slate-50/95 py-5 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-3">
            {leadingSlot ? (
              <div className="shrink-0 pt-0.5">{leadingSlot}</div>
            ) : null}
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
              {addon ? <div className="mt-2">{addon}</div> : null}
            </div>
          </div>
        </div>
        {rightSlot ? (
          <div className="flex shrink-0 items-center gap-3">{rightSlot}</div>
        ) : null}
      </div>
    </header>
  );
}
