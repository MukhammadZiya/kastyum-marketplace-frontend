type Props = {
  columns: readonly string[];
  emptyMessage: string;
};

/**
 * Table shell for list views; swap body for React Query rows later.
 */
export function DataTablePlaceholder({ columns, emptyMessage }: Props) {
  return (
    <table className="w-full min-w-[520px] text-left text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-xs font-medium uppercase tracking-wide text-slate-400">
          {columns.map((col) => (
            <th key={col} className="px-4 py-3 font-medium">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            colSpan={columns.length}
            className="px-4 py-12 text-center text-slate-500"
          >
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
