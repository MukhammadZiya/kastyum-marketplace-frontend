import type { ReactNode } from "react";
import { SellerSidebar } from "../components/seller/SellerSidebar";
import { SellerTopbar } from "../components/seller/SellerTopbar";
import type { SellerSection } from "../constants/sellerNavigation";

type Props = {
  activeSection: SellerSection;
  onSelectSection: (section: SellerSection) => void;
  children: ReactNode;
};

export function SellerLayout({
  activeSection,
  onSelectSection,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <SellerSidebar activeSection={activeSection} onSelect={onSelectSection} />
        <main className="flex-1 p-8">
          <SellerTopbar />
          {children}
        </main>
      </div>
    </div>
  );
}

