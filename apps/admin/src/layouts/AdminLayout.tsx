import type { ReactNode } from "react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminTopbar } from "../components/admin/AdminTopbar";
import type { AdminSection } from "../constants/adminNavigation";

type Props = {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  children: ReactNode;
};

export function AdminLayout({
  activeSection,
  onSelectSection,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <AdminSidebar activeSection={activeSection} onSelect={onSelectSection} />
        <main className="flex-1 p-8">
          <AdminTopbar />
          {children}
        </main>
      </div>
    </div>
  );
}

