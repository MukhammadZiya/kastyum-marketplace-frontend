import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminAppShell } from "./layouts/AdminAppShell";
import { DashboardPage } from "./modules/dashboard/DashboardPage";
import { OrdersPage } from "./modules/orders/OrdersPage";
import { ProductsPage } from "./modules/products/ProductsPage";
import { SellersPage } from "./modules/sellers/SellersPage";
import { UsersPage } from "./modules/users/UsersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminAppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sellers" element={<SellersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
