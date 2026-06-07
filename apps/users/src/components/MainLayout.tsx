import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartSidebarModal from "./Common/CartSidebarModal";
import ScrollToTop from "./Common/ScrollToTop";

export function MainLayout() {
  const { pathname, search } = useLocation();

  /** Mobile header stacks into rows; desktop header is a compact search bar. */
  const mainTopPadding = "pt-[148px] lg:pt-[82px]";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className={mainTopPadding}>
        <Outlet />
      </main>
      <Footer />
      <CartSidebarModal />
      <ScrollToTop />
    </div>
  );
}
