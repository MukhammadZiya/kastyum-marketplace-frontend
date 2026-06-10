import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthToken } from "@repo/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Heart,
  LogOut,
  Search,
  ShoppingCart,
  Store,
  UserRound,
} from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "../../context/cart";
import { useCartModal } from "../../context/cartSidebarModal";
import { useMemberMe } from "../../hooks/members";
import { useT } from "../../i18n";
import { getSellerSignInUrl, getSellerSignupUrl } from "../../lib/sellerAppUrl";
import { clearMarketplaceSession } from "../../user-auth";

const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tokenPresent = Boolean(getAuthToken());
  const { data: me, isPending } = useMemberMe();
  const { openCartModal } = useCartModal();
  const { items } = useCart();
  const t = useT();

  const [searchQuery, setSearchQuery] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [signInMenuOpen, setSignInMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const qs = params.toString();
    navigate(qs ? `/shop-with-sidebar?${qs}` : "/shop-with-sidebar");
  };

  const accountName =
    me?.nick?.trim() || me?.email || (isPending ? t("common.loading") : t("common.signIn"));

  return (
    <header
      className="relative z-40 w-full border-t-4 border-[#E11D48] border-b border-neutral-200 bg-white"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 xl:px-0">
        <div className="flex min-h-[74px] items-center justify-between gap-4 py-3 lg:min-h-[88px] lg:py-4">
          <Link
            className="flex shrink-0 items-center gap-2.5 rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E11D48]"
            to="/"
            aria-label="iBerry home"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E11D48] text-xl font-black tracking-tight text-white shadow-[0_16px_30px_-18px_rgba(225,29,72,0.9)] lg:h-14 lg:w-14 lg:text-2xl">
              iB
            </span>
            <span className="text-[30px] font-black tracking-tight text-[#111827] lg:text-[34px]">
              iBerry
            </span>
          </Link>

          <nav className="hidden items-center gap-10 text-[17px] font-black text-neutral-950 lg:flex">
            <Link className="transition hover:text-[#E11D48]" to="/contact">
              About
            </Link>
            <button className="transition hover:text-[#E11D48]" type="button">
              News
            </button>
            <button
              type="button"
              className="transition hover:text-[#E11D48]"
              onClick={() => window.open(getSellerSignupUrl(), "_blank", "noopener,noreferrer")}
            >
              {t("common.sellOnIberry")}
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-neutral-200 bg-white p-1 shadow-sm lg:block">
              <LanguageSwitcher />
            </div>

            <button
              onClick={openCartModal}
              type="button"
              className="relative hidden items-center gap-2 rounded-2xl px-3 py-2 text-sm font-black text-neutral-950 transition hover:bg-[#FFF1F2] lg:flex"
            >
              <ShoppingCart className="h-6 w-6" strokeWidth={2.2} />
              <span className="absolute left-6 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E11D48] px-1 text-[11px] text-white">
                {items.length}
              </span>
              {t("common.cart")}
            </button>

            {tokenPresent ? (
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  className="flex min-w-[230px] items-center gap-3 rounded-full bg-[#FFF1F2] py-2 pl-2 pr-4 text-left transition hover:bg-[#FFE4EA]"
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#FFE4EA] bg-white text-neutral-400">
                    <UserRound className="h-6 w-6" strokeWidth={2.1} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-black text-[#BE123C]">
                      {accountName}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#E11D48] transition ${accountMenuOpen ? "rotate-180" : ""}`}
                    strokeWidth={2.4}
                  />
                </button>

                {accountMenuOpen ? (
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-[260px] overflow-hidden rounded-2xl border border-neutral-100 bg-white p-2 shadow-[0_24px_90px_-42px_rgba(15,23,42,0.55)]"
                    role="menu"
                  >
                    <Link
                      to="/my-account"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-neutral-800 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
                      role="menuitem"
                    >
                      <UserRound className="h-5 w-5" strokeWidth={2.1} />
                      {t("common.myAccount")}
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-neutral-800 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
                      role="menuitem"
                    >
                      <ShoppingCart className="h-5 w-5" strokeWidth={2.1} />
                      {t("common.cart")}
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-neutral-800 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
                      role="menuitem"
                    >
                      <Heart className="h-5 w-5" strokeWidth={2.1} />
                      {t("common.wishlist")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        clearMarketplaceSession(queryClient);
                        navigate("/", { replace: true });
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black text-neutral-800 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
                      role="menuitem"
                    >
                      <LogOut className="h-5 w-5" strokeWidth={2.1} />
                      {t("common.logOut")}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setSignInMenuOpen((open) => !open)}
                  className="flex items-center gap-3 rounded-full bg-[#FFF1F2] py-2 pl-2 pr-5 font-black text-[#BE123C] transition hover:bg-[#FFE4EA]"
                  aria-expanded={signInMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#FFE4EA] bg-white text-neutral-400">
                    <UserRound className="h-6 w-6" strokeWidth={2.1} />
                  </span>
                  {t("common.signIn")}
                  <ChevronDown
                    className={`h-4 w-4 transition ${signInMenuOpen ? "rotate-180" : ""}`}
                    strokeWidth={2.4}
                  />
                </button>

                {signInMenuOpen ? (
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-[220px] overflow-hidden rounded-2xl border border-neutral-100 bg-white p-2 shadow-[0_24px_90px_-42px_rgba(15,23,42,0.55)]"
                    role="menu"
                  >
                    <Link
                      to="/signin"
                      onClick={() => setSignInMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-neutral-800 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
                      role="menuitem"
                    >
                      <UserRound className="h-5 w-5" strokeWidth={2.1} />
                      {t("common.signInAsUser")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInMenuOpen(false);
                        window.location.href = getSellerSignInUrl();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-black text-neutral-800 transition hover:bg-[#FFF1F2] hover:text-[#BE123C]"
                      role="menuitem"
                    >
                      <Store className="h-5 w-5" strokeWidth={2.1} />
                      {t("common.signInAsSeller")}
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            <div className="lg:hidden">
              <LanguageSwitcher />
            </div>
            <button
              onClick={openCartModal}
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-950 lg:hidden"
              aria-label={t("common.cart")}
            >
              <ShoppingCart className="h-6 w-6" strokeWidth={2.2} />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E11D48] px-1 text-[11px] font-black text-white">
                {items.length}
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-3 pb-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
          <Link
            to="/shop-with-sidebar"
            className="hidden h-14 items-center justify-center rounded-xl bg-[#E11D48] px-6 text-xl font-black text-white shadow-[0_18px_44px_-30px_rgba(225,29,72,0.9)] transition hover:-translate-y-px hover:bg-[#BE123C] lg:flex"
          >
            Shop
          </Link>

          <form onSubmit={handleSearchSubmit} className="min-w-0">
            <div className="flex h-[52px] items-center rounded-xl border border-neutral-200 bg-white shadow-[0_18px_60px_-46px_rgba(15,23,42,0.7)] transition focus-within:border-[#E11D48]/70 focus-within:ring-4 focus-within:ring-[#E11D48]/10 lg:h-14">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                type="search"
                name="search"
                id="search"
                placeholder={t("headerSearchPlaceholder")}
                autoComplete="off"
                className="h-full min-w-0 flex-1 bg-transparent px-5 text-[15px] font-semibold text-neutral-900 outline-none placeholder:text-neutral-400 lg:text-lg"
              />
              <button
                id="search-btn"
                aria-label={t("common.ariaSearch")}
                className="m-1 flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-[#E11D48] text-white transition hover:bg-[#BE123C] lg:h-12 lg:w-14"
                type="submit"
              >
                <Search className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          </form>

        </div>
      </div>
    </header>
  );
};

export default Header;
