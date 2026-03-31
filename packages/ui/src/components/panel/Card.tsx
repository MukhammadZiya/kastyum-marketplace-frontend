import type { ReactNode } from "react";
import { clsx } from "clsx";

type CardProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Card({
  title,
  description,
  action,
  children,
  className,
}: CardProps) {
  const hasHeader = Boolean(title ?? description ?? action);

  return (
    <section
      className={clsx(
        "rounded-2xl border border-slate-200/90 bg-white p-6",
        className,
      )}
    >
      {hasHeader ? (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
