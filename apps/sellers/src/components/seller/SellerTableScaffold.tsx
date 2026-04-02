import type { ReactNode } from "react";

type Props = {
  columns: readonly string[];
  emptyLabel: string;
  children?: ReactNode;
};

export function SellerTableScaffold({
  columns,
  emptyLabel,
  children,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children ?? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-14 text-center text-slate-500"
              >
                {emptyLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
