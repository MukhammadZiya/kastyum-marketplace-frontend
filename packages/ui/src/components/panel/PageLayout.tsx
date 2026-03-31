import type { ReactNode } from "react";
import { clsx } from "clsx";

type PageLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageLayout({ sidebar, children, className }: PageLayoutProps) {
  return (
    <div
      className={clsx(
        "min-h-screen bg-slate-50 text-slate-900 antialiased",
        className,
      )}
    >
      {sidebar}
      <div className="min-h-screen pl-[260px]">{children}</div>
    </div>
  );
}
