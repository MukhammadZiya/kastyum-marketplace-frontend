import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { HomePage } from "./pages/HomePage";
import { ShopWithSidebarPage } from "./pages/ShopWithSidebarPage";
import { ShopWithoutSidebarPage } from "./pages/ShopWithoutSidebarPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PaymentResultPage } from "./pages/PaymentResultPage";
import { ContactPage } from "./pages/ContactPage";
import { WishlistPage } from "./pages/WishlistPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ErrorPage } from "./pages/ErrorPage";
import { MailSuccessPage } from "./pages/MailSuccessPage";
import { ShopDetailsPage } from "./pages/ShopDetailsPage";
import { BlogGridWithSidebarPage } from "./pages/BlogGridWithSidebarPage";
import { BlogGridPage } from "./pages/BlogGridPage";
import { BlogDetailsWithSidebarPage } from "./pages/BlogDetailsWithSidebarPage";
import { BlogDetailsPage } from "./pages/BlogDetailsPage";
import { MyAccountPage } from "./pages/MyAccountPage";
import { TelegramLoginPage } from "./pages/TelegramLoginPage";

type AppProps = {
  basename?: string;
};

function App({ basename }: AppProps = {}) {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop-with-sidebar" element={<ShopWithSidebarPage />} />
          <Route path="shop-without-sidebar" element={<ShopWithoutSidebarPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment-result" element={<PaymentResultPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="shop-details" element={<ShopDetailsPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="telegram-login" element={<TelegramLoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="my-account" element={<MyAccountPage />} />
          <Route path="error" element={<ErrorPage />} />
          <Route path="mail-success" element={<MailSuccessPage />} />
          <Route path="blogs/blog-grid-with-sidebar" element={<BlogGridWithSidebarPage />} />
          <Route path="blogs/blog-grid" element={<BlogGridPage />} />
          <Route path="blogs/blog-details-with-sidebar" element={<BlogDetailsWithSidebarPage />} />
          <Route path="blogs/blog-details" element={<BlogDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
