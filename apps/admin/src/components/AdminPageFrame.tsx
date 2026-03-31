import type { ReactNode } from "react";
import { Topbar } from "@repo/ui";
import { logoutAdmin } from "../lib/logoutAdmin";
import { AdminTopbarActions } from "./AdminTopbarActions";

type Props = {
  title: string;
  addon?: ReactNode;
  children: ReactNode;
};

export function AdminPageFrame({ title, addon, children }: Props) {
  return (
    <>
      <Topbar
        title={title}
        addon={addon}
        rightSlot={<AdminTopbarActions onLogout={logoutAdmin} />}
      />
      <div className="space-y-6 pt-1">{children}</div>
    </>
  );
}
