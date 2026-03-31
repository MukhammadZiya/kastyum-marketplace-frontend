import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminAppShell } from "./layouts/AdminAppShell";
import { DashboardPage } from "./modules/dashboard/DashboardPage";
import { OrdersListPage } from "./modules/orders/OrdersListPage";
import { OrdersPage } from "./modules/orders/OrdersPage";
import { ProductCreatePage } from "./modules/products/ProductCreatePage";
import { ProductsListPage } from "./modules/products/ProductsListPage";
import { ProductsPage } from "./modules/products/ProductsPage";
import { SellerCreatePage } from "./modules/sellers/SellerCreatePage";
import { SellersListPage } from "./modules/sellers/SellersListPage";
import { SellersPage } from "./modules/sellers/SellersPage";
import { UserCreatePage } from "./modules/users/UserCreatePage";
import { UsersListPage } from "./modules/users/UsersListPage";
import { UsersPage } from "./modules/users/UsersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminAppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<Outlet />}>
            <Route index element={<UsersPage />} />
            <Route path="list" element={<UsersListPage />} />
            <Route path="new" element={<UserCreatePage />} />
          </Route>
          <Route path="sellers" element={<Outlet />}>
            <Route index element={<SellersPage />} />
            <Route path="list" element={<SellersListPage />} />
            <Route path="new" element={<SellerCreatePage />} />
          </Route>
          <Route path="products" element={<Outlet />}>
            <Route index element={<ProductsPage />} />
            <Route path="list" element={<ProductsListPage />} />
            <Route path="new" element={<ProductCreatePage />} />
          </Route>
          <Route path="orders" element={<Outlet />}>
            <Route index element={<OrdersPage />} />
            <Route path="list" element={<OrdersListPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
