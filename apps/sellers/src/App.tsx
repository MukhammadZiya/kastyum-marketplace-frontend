import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireSellerAuth } from "./layouts/RequireSellerAuth";
import { SellerAppShell } from "./layouts/SellerAppShell";
import { SellerSignInPage } from "./modules/auth/SellerSignInPage";
import { SellerSignUpPage } from "./modules/auth/SellerSignUpPage";
import { SellerOrdersPage } from "./modules/orders/SellerOrdersPage";
import { SellerInventoryPage } from "./modules/products/SellerInventoryPage";

type AppProps = {
  basename?: string;
};

function App({ basename }: AppProps = {}) {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/signin" element={<SellerSignInPage />} />
        <Route path="/signup" element={<SellerSignUpPage />} />
        <Route element={<RequireSellerAuth />}>
          <Route path="/" element={<SellerAppShell />}>
            <Route index element={<Navigate to="/inventory" replace />} />
            <Route path="inventory" element={<SellerInventoryPage />} />
            <Route path="orders" element={<SellerOrdersPage />} />
            <Route path="*" element={<Navigate to="/inventory" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
