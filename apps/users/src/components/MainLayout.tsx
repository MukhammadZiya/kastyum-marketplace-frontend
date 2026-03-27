import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartSidebarModal from "./Common/CartSidebarModal";
import QuickViewModal from "./Common/QuickViewModal";
import ScrollToTop from "./Common/ScrollToTop";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="pt-[165px]">
        <Outlet />
      </main>
      <Footer />
      <CartSidebarModal />
      <QuickViewModal />
      <ScrollToTop />
    </div>
  );
}
