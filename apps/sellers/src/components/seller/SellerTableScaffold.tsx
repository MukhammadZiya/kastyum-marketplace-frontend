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
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-[#FAFAFB] text-xs font-black uppercase tracking-[0.14em] text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-black">
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
                className="px-4 py-14 text-center text-sm font-medium text-slate-500"
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
