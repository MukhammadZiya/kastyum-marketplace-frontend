import type { ReactNode } from "react";
import { clsx } from "clsx";

type BadgeVariant = "neutral" | "accent";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClass: Record<BadgeVariant, string> = {
  neutral: "border-slate-200 bg-slate-100 text-slate-600",
  accent: "border-[#FFE4EA] bg-[#FFF1F2] text-[#BE123C]",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
