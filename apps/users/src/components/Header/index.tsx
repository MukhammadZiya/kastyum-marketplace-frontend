import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomSelect from "./CustomSelect";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getNavMenuItems } from "./menuData";
import { useCart } from "../../context/cart";
import { useCartModal } from "../../context/cartSidebarModal";
import { headerCatalogOptions } from "../../data/headerCatalogOptions";
import { useT } from "../../i18n";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCatalog, setSearchCatalog] = useState("all");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModal();

  const { items, totalPrice } = useCart();
  const t = useT();
  const menuItems = useMemo(() => getNavMenuItems(t), [t]);
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
      className={`fixed left-0 top-0 w-full z-[9999] bg-white transition-all ease-in-out duration-300 ${
        stickyMenu ? "shadow" : ""
      }`}
    >
      <div className="relative z-30 max-w-[1170px] mx-auto px-4 sm:px-[30px] xl:px-0">
        <div
          className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${
            stickyMenu ? "py-4" : "py-6"
          }`}
        >
          <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
            <Link className="flex-shrink-0" to="/">
              <img
                src="/images/logo/logo.svg"
                alt="Logo"
                width={219}
                height={36}
              />
            </Link>

            <div className="max-w-[475px] w-full">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center">
                  <CustomSelect
                    options={catalogOptions}
                    value={searchCatalog}
                    onChange={setSearchCatalog}
                  />

                  <div className="relative max-w-[333px] sm:min-w-[333px] w-full">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-[22px] bg-gray-200" />
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      type="search"
                      name="search"
                      id="search"
                      placeholder={t("headerSearchPlaceholder")}
                      autoComplete="off"
                      className="w-full rounded-r-[5px] bg-neutral-50 border border-neutral-200 border-l-0 py-2.5 pl-4 pr-10 outline-none ease-in duration-200"
                    />

                    <button
                      id="search-btn"
                      aria-label={t("common.ariaSearch")}
                      className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 ease-in duration-200 hover:text-blue-600"
                      type="submit"
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="flex w-full lg:w-auto justify-between items-center gap-5">
              <div className="flex items-center gap-4 sm:gap-5">
                <LanguageSwitcher />

                <Link to="/signin" className="flex items-center gap-[10px]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 1.25C9.37666 1.25 7.25001 3.37665 7.25001 6C7.25001 8.62335 9.37666 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25Z"
                      fill="#3C50E0"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 12.25C9.68646 12.25 7.55494 12.7759 5.97546 13.6643C4.4195 14.5396 3.25001 15.8661 3.25001 17.5L3.24995 17.602C3.24882 18.7638 3.2474 20.222 4.52642 21.2635C5.15589 21.7761 6.03649 22.1406 7.22622 22.3815C8.41927 22.6229 9.97424 22.75 12 22.75C14.0258 22.75 15.5808 22.6229 16.7738 22.3815C17.9635 22.1406 18.8441 21.7761 19.4736 21.2635C20.7526 20.222 20.7512 18.7638 20.7501 17.602L20.75 17.5C20.75 15.8661 19.5805 14.5396 18.0246 13.6643C16.4451 12.7759 14.3136 12.25 12 12.25Z"
                      fill="#3C50E0"
                    />
                  </svg>

                  <div>
                    <span className="block text-[10px] text-neutral-500 uppercase">
                      {t("common.account")}
                    </span>
                    <p className="font-medium text-[14px] text-neutral-900">
                      {t("common.signIn")}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={openCartModal}
                  type="button"
                  className="-mx-1 flex items-center gap-[10px] rounded-xl px-2.5 py-1.5 transition duration-200 ease-out hover:bg-neutral-100/90 hover:shadow-sm active:scale-[0.99]"
                >
                  <span className="inline-block relative">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.29266 2.7512C1.43005 2.36044 1.8582 2.15503 2.24896 2.29242L2.55036 2.39838C3.16689 2.61511 3.69052 2.79919 4.10261 3.00139C4.54324 3.21759 4.92109 3.48393 5.20527 3.89979C5.48725 4.31243 5.60367 4.76515 5.6574 5.26153Z"
                        fill="#3C50E0"
                      />
                    </svg>

                    <span className="flex items-center justify-center font-medium text-[10px] absolute -right-2 -top-2.5 bg-blue-600 w-[18px] h-[18px] rounded-full text-white">
                      {items.length}
                    </span>
                  </span>

                  <div>
                    <span className="block text-[10px] text-neutral-500 uppercase">
                      {t("common.cart")}
                    </span>
                    <p className="font-medium text-[14px] text-neutral-900">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </button>
              </div>

              <button
                id="Toggle"
                aria-label={t("common.ariaToggler")}
                className="xl:hidden block"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span className="block relative cursor-pointer w-[22px] h-[22px]">
                  <span className="block absolute right-0 w-full h-full">
                    <span
                      className={`block relative top-0 left-0 bg-neutral-900 rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${
                        !navigationOpen ? "!w-full delay-300" : ""
                      }`}
                    />
                    <span
                      className={`block relative top-0 left-0 bg-neutral-900 rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${
                        !navigationOpen ? "!w-full delay-400" : ""
                      }`}
                    />
                    <span
                      className={`block relative top-0 left-0 bg-neutral-900 rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${
                        !navigationOpen ? "!w-full delay-500" : ""
                      }`}
                    />
                  </span>

                  <span className="block absolute right-0 w-full h-full rotate-45">
                    <span
                      className={`block bg-neutral-900 rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${
                        !navigationOpen ? "!h-0 delay-[0]" : ""
                      }`}
                    />
                    <span
                      className={`block bg-neutral-900 rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${
                        !navigationOpen ? "!h-0 delay-200" : ""
                      }`}
                    />
                  </span>
                </span>
              </button>
          </div>
        </div>
      </div>

      <div className="relative z-20 border-t border-neutral-200">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-[30px] xl:px-0">
          <div className="flex items-center justify-between">
            <div
              className={`w-[288px] absolute right-4 top-full xl:static xl:w-auto h-0 xl:h-auto invisible xl:visible xl:flex items-center justify-between ${
                navigationOpen
                  ? "!visible bg-white shadow-lg border border-neutral-200 !h-auto max-h-[400px] overflow-y-scroll rounded-md p-5"
                  : ""
              }`}
            >
              <nav className="min-w-0 xl:max-w-[calc(100vw-12rem)] xl:overflow-x-auto xl:pb-1">
                <ul className="flex flex-col gap-5 xl:flex-row xl:flex-nowrap xl:items-center xl:gap-5">
                  {menuItems.map((menuItem) => (
                    <li
                      key={menuItem.id}
                      className="group relative before:absolute before:left-0 before:top-0 before:h-[3px] before:w-0 before:rounded-b-[3px] before:bg-blue-600 before:duration-200 before:ease-out hover:before:w-full"
                    >
                      <Link
                        to={menuItem.path}
                        className={`flex text-[14px] font-medium text-neutral-900 hover:text-blue-600 ${
                          stickyMenu ? "xl:py-4" : "xl:py-6"
                        }`}
                      >
                        {menuItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Wishlist link hidden for now — restore when ready */}
            {/* <div className="hidden xl:block">
              <ul className="flex items-center gap-[22px]">
                <li className="py-4">
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-[6px] font-medium text-[14px] text-neutral-900 hover:text-blue-600"
                  >
                    {t("common.wishlist")}
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

