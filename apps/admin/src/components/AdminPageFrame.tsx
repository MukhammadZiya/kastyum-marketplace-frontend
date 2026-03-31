import type { ReactNode } from "react";
import { Topbar } from "@repo/ui";
import { logoutAdmin } from "../lib/logoutAdmin";
import { AdminTopbarActions } from "./AdminTopbarActions";

type Props = {
  title: string;
  /** In-module navigation (Overview / List / Add) */
  tabs?: ReactNode;
  addon?: ReactNode;
  children: ReactNode;
};

export function AdminPageFrame({ title, tabs, addon, children }: Props) {
  return (
    <>
      <Topbar
        title={title}
        addon={
          <>
            {tabs ? <div className="mb-3">{tabs}</div> : null}
            {addon}
          </>
        }
        rightSlot={<AdminTopbarActions onLogout={logoutAdmin} />}
      />
      <div className="space-y-6 pt-1">{children}</div>
    </>
  );
}
