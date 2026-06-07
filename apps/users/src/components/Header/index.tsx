import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthToken } from "@repo/api";
import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import CustomSelect from "./CustomSelect";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "../../context/cart";
import { useCartModal } from "../../context/cartSidebarModal";
import { headerCatalogOptions } from "../../data/headerCatalogOptions";
import { useMemberMe } from "../../hooks/members";
import { useT } from "../../i18n";

const Header = () => {
  const navigate = useNavigate();
  const tokenPresent = Boolean(getAuthToken());
  const { data: me, isPending } = useMemberMe();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCatalog, setSearchCatalog] = useState("all");
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModal();

  const { items, totalPrice } = useCart();
  const t = useT();
  const catalogOptions = useMemo(() => headerCatalogOptions(t), [t]);

  const handleStickyMenu = () => {
    setStickyMenu(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCatalog !== "all") params.set("device", searchCatalog);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const qs = params.toString();
    navigate(qs ? `/shop-with-sidebar?${qs}` : "/shop-with-sidebar");
  };

  return (
    <header
      className={`fixed left-0 top-0 z-[9999] w-full border-b border-neutral-200 bg-white/95 backdrop-blur transition-all duration-300 ease-out ${
        stickyMenu ? "shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)]" : ""
      }`}
    >
      <div className="relative z-30 mx-auto max-w-[1170px] px-4 sm:px-[30px] xl:px-0">
        <div
          className={`grid gap-3 ease-out duration-200 lg:grid-cols-[auto_minmax(340px,1fr)_auto] lg:items-center ${
            stickyMenu ? "py-3" : "py-4"
          }`}
        >
          <div className="flex w-full items-center justify-between gap-3 lg:w-auto">
            <Link
              className="flex shrink-0 items-center gap-2.5 rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E11D48]"
              to="/"
              aria-label="iBerry home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E11D48] text-xl font-black tracking-tight text-white shadow-[0_14px_30px_-18px_rgba(225,29,72,0.9)]">
                iB
              </span>
              <span className="text-[28px] font-black tracking-tight text-[#111827]">
                iBerry
              </span>
            </Link>

          </div>

          <div className="w-full min-w-0">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex h-12 items-center rounded-2xl border border-neutral-200 bg-neutral-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition focus-within:border-[#E11D48]/60 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#E11D48]/10">
                <div className="hidden shrink-0 sm:block [&_button]:!h-12 [&_button]:!rounded-l-2xl [&_button]:!border-0 [&_button]:!bg-transparent">
                  <CustomSelect
                    options={catalogOptions}
                    value={searchCatalog}
                    onChange={setSearchCatalog}
                  />
                </div>

                <div className="relative min-w-0 flex-1">
                  <input
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    type="search"
                    name="search"
                    id="search"
                    placeholder={t("headerSearchPlaceholder")}
                    autoComplete="off"
                    className="h-12 w-full bg-transparent pl-4 pr-12 text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
                  />
                  <button
                    id="search-btn"
                    aria-label={t("common.ariaSearch")}
                    className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#E11D48] text-white transition hover:bg-[#BE123C]"
                    type="submit"
                  >
                    <Search className="h-4.5 w-4.5" strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-end">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <LanguageSwitcher />

                {tokenPresent ? (
                  <div className="relative z-10 hidden items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-neutral-50 sm:flex">
                    {me ? (
                      <>
                        <UserRound className="h-5 w-5 shrink-0 text-[#E11D48]" strokeWidth={2.25} />
                        <div className="min-w-0 text-left">
                          <span className="block text-[10px] text-neutral-500 uppercase">
                            {t("common.signedIn")}
                          </span>
                          <Link
                            to="/my-account"
                            title={t("common.myAccount")}
                            className="block max-w-[100px] truncate sm:max-w-[160px] font-medium text-[14px] text-neutral-900 hover:text-blue-600"
                          >
                            {me.nick?.trim() || me.email}
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="min-w-0 text-left">
                        <span className="block text-[10px] text-neutral-500 uppercase">
                          {t("common.account")}
                        </span>
                        <p className="max-w-[120px] truncate text-[14px] font-medium text-neutral-600 sm:max-w-[200px]">
                          {isPending ? t("common.loading") : t("common.sessionCouldNotLoad")}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/signin" className="hidden items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-neutral-50 sm:flex">
                    <UserRound className="h-5 w-5 shrink-0 text-[#E11D48]" strokeWidth={2.25} />
                    <div className="leading-tight">
                      <span className="block text-[10px] text-neutral-500 uppercase">
                        {t("common.account")}
                      </span>
                      <p className="font-medium text-[14px] text-neutral-900">
                        {t("common.signIn")}
                      </p>
                    </div>
                  </Link>
                )}

                <Link
                  to="/wishlist"
                  aria-label="Wishlist"
                  className="hidden h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-800 transition hover:border-[#E11D48]/40 hover:bg-[#FFF1F2] hover:text-[#E11D48] sm:inline-flex"
                >
                  <Heart className="h-5 w-5" strokeWidth={2.1} />
                </Link>

                <button
                  onClick={openCartModal}
                  type="button"
                  className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition duration-200 ease-out hover:bg-neutral-100/90 active:scale-[0.99]"
                >
                  <span className="inline-block relative">
                    <ShoppingBag className="h-6 w-6 text-[#111827]" strokeWidth={2.1} />

                    <span className="absolute -right-2 -top-2.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E11D48] text-[10px] font-semibold text-white">
                      {items.length}
                    </span>
                  </span>

                  <div className="hidden leading-tight sm:block">
                    <span className="block text-[10px] text-neutral-500 uppercase">
                      {t("common.cart")}
                    </span>
                    <p className="font-medium text-[14px] text-neutral-900">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </button>
              </div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
