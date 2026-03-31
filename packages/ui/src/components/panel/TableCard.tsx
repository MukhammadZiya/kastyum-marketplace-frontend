import type { ReactNode } from "react";
import { Card } from "./Card";

type TableCardProps = {
  title: string;
  description?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Table-sized content area; pass a `<table>` or empty state as children.
 * Keeps overflow scrolling consistent for Users / Sellers / Orders modules.
 */
export function TableCard({
  title,
  description,
  toolbar,
  children,
  className,
}: TableCardProps) {
  return (
    <Card
      title={title}
      description={description}
      action={toolbar}
      className={className}
    >
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}
