import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartSidebarModal from "./Common/CartSidebarModal";
import QuickViewModal from "./Common/QuickViewModal";
import ScrollToTop from "./Common/ScrollToTop";

export function MainLayout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

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
