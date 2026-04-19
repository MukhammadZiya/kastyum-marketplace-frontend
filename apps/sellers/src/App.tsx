import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireSellerAuth } from "./layouts/RequireSellerAuth";
import { SellerAppShell } from "./layouts/SellerAppShell";
import { SellerSignInPage } from "./modules/auth/SellerSignInPage";
import { SellerSignUpPage } from "./modules/auth/SellerSignUpPage";
import { SellerProductsPage } from "./modules/products/SellerProductsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SellerSignInPage />} />
        <Route path="/signup" element={<SellerSignUpPage />} />
        <Route element={<RequireSellerAuth />}>
          <Route path="/" element={<SellerAppShell />}>
            <Route index element={<SellerProductsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
