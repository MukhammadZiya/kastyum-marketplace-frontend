import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireSellerAuth } from "./layouts/RequireSellerAuth";
import { SellerAppShell } from "./layouts/SellerAppShell";
import { SellerSignInPage } from "./modules/auth/SellerSignInPage";
import { SellerSignUpPage } from "./modules/auth/SellerSignUpPage";
import { SellerDashboardPage } from "./modules/dashboard/SellerDashboardPage";
import { OrdersListPage } from "./modules/orders/OrdersListPage";
import { OrdersOverviewPage } from "./modules/orders/OrdersOverviewPage";
import { ProductCreatePage } from "./modules/products/ProductCreatePage";
import { ProductsListPage } from "./modules/products/ProductsListPage";
import { ProductsOverviewPage } from "./modules/products/ProductsOverviewPage";
import { StoreEditPage } from "./modules/store/StoreEditPage";
import { StoreOverviewPage } from "./modules/store/StoreOverviewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SellerSignInPage />} />
        <Route path="/signup" element={<SellerSignUpPage />} />
        <Route element={<RequireSellerAuth />}>
          <Route path="/" element={<SellerAppShell />}>
            <Route index element={<SellerDashboardPage />} />
            <Route path="products" element={<ProductsOverviewPage />} />
            <Route path="products/list" element={<ProductsListPage />} />
            <Route path="products/new" element={<ProductCreatePage />} />
            <Route path="orders" element={<OrdersOverviewPage />} />
            <Route path="orders/list" element={<OrdersListPage />} />
            <Route path="store" element={<StoreOverviewPage />} />
            <Route path="store/edit" element={<StoreEditPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
