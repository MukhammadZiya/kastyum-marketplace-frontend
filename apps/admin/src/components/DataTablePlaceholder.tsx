import type { ReactNode } from "react";

type Props = {
  columns: readonly string[];
  emptyMessage: string;
  children?: ReactNode;
};

export function DataTablePlaceholder({
  columns,
  emptyMessage,
  children,
}: Props) {
  return (
    <table className="w-full min-w-[520px] overflow-hidden text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 bg-[#FAFAFB] text-xs font-black uppercase tracking-[0.14em] text-slate-400">
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
              className="px-4 py-12 text-center font-medium text-slate-500"
            >
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
