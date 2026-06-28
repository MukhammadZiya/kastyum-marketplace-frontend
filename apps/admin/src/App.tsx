import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminAppShell } from "./layouts/AdminAppShell";
import { RequireAdminAuth } from "./layouts/RequireAdminAuth";
import { AdminLoginPage } from "./modules/auth/AdminLoginPage";
import { OrdersListPage } from "./modules/orders/OrdersListPage";
import { ProductCreatePage } from "./modules/products/ProductCreatePage";
import { ProductsListPage } from "./modules/products/ProductsListPage";
import { SellersListPage } from "./modules/sellers/SellersListPage";
import { SellerDetailPage } from "./modules/sellers/SellerDetailPage";
import { UsersListPage } from "./modules/users/UsersListPage";
import { CategoriesListPage } from "./modules/categories/CategoriesListPage";
import { GlobalSearchPage } from "./modules/search/GlobalSearchPage";

type AppProps = {
  basename?: string;
};

function App({ basename }: AppProps = {}) {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route element={<RequireAdminAuth />}>
          <Route path="/" element={<AdminAppShell />}>
            <Route index element={<Navigate to="/users/list" replace />} />
            <Route path="users" element={<Outlet />}>
              <Route index element={<Navigate to="/users/list" replace />} />
              <Route path="list" element={<UsersListPage />} />
            </Route>
            <Route path="sellers" element={<Outlet />}>
              <Route index element={<Navigate to="/sellers/list" replace />} />
              <Route path="list" element={<SellersListPage />} />
              <Route path="detail/:id" element={<SellerDetailPage />} />
            </Route>
            <Route path="products" element={<Outlet />}>
              <Route index element={<Navigate to="/products/list" replace />} />
              <Route path="list" element={<ProductsListPage />} />
              <Route path="new" element={<ProductCreatePage />} />
            </Route>
            <Route path="orders" element={<Outlet />}>
              <Route index element={<Navigate to="/orders/list" replace />} />
              <Route path="list" element={<OrdersListPage />} />
            </Route>
            <Route path="categories" element={<Outlet />}>
              <Route index element={<Navigate to="/categories/list" replace />} />
              <Route path="list" element={<CategoriesListPage />} />
            </Route>
            <Route path="search" element={<GlobalSearchPage />} />
            <Route path="*" element={<Navigate to="/users/list" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
