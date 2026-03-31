import { TableCard } from "@repo/ui";
import { AdminPageFrame } from "../components/AdminPageFrame";
import {
  ADMIN_PAGE_TITLES,
  type AdminNavId,
} from "../constants/adminNavigation";

type Props = {
  navId: AdminNavId;
  tableTitle: string;
  tableDescription?: string;
  emptyMessage?: string;
};

export function ModuleTablePage({
  navId,
  tableTitle,
  tableDescription,
  emptyMessage = "No rows yet — connect React Query and your API here.",
}: Props) {
  const title = ADMIN_PAGE_TITLES[navId];

  return (
    <AdminPageFrame title={title}>
      <TableCard title={tableTitle} description={tableDescription}>
        <div className="py-12 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      </TableCard>
    </AdminPageFrame>
  );
}
