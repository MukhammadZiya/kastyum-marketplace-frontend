import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { MenuItem } from "../../types/menu";

export default function Dropdown({
  menuItem,
  stickyMenu,
}: {
  menuItem: MenuItem;
  stickyMenu: boolean;
}) {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const { pathname } = useLocation();

  const isActive = pathname.toLowerCase().includes(menuItem.title.toLowerCase());

  return (
    <li
      onClick={() => setDropdownToggler((v) => !v)}
      className={`group relative before:w-0 before:h-[3px] before:bg-blue-600 before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full ${
        isActive ? "before:!w-full" : ""
      }`}
    >
      <button
        type="button"
        className={`hover:text-blue-600 text-[14px] font-medium text-neutral-900 flex items-center gap-[6px] capitalize ${
          stickyMenu ? "xl:py-4" : "xl:py-6"
        } ${isActive ? "!text-blue-600" : ""}`}
      >
        {menuItem.title}
        <svg
          className="fill-current cursor-pointer"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.95363 5.67461C3.13334 5.46495 3.44899 5.44067 3.65866 5.62038L7.99993 9.34147L12.3412 5.62038C12.5509 5.44067 12.8665 5.46495 13.0462 5.67461C13.2259 5.88428 13.2017 6.19993 12.992 6.37964L8.32532 10.3796C8.13808 10.5401 7.86178 10.5401 7.67453 10.3796L3.00787 6.37964C2.7982 6.19993 2.77392 5.88428 2.95363 5.67461Z"
            fill=""
          />
        </svg>
      </button>

      <ul
        className={`absolute left-0 top-full z-50 hidden min-w-[220px] flex-col rounded-md border border-neutral-200 bg-white py-2 shadow-lg xl:group-hover:flex ${
          dropdownToggler ? "flex" : ""
        } ${stickyMenu ? "xl:translate-y-0" : "xl:translate-y-0"}`}
      >
        {(menuItem.submenu ?? []).map((item) => (
          <li key={item.id}>
            <Link
              to={item.path}
              className={`flex text-[14px] hover:text-blue-600 hover:bg-neutral-50 py-[7px] px-[18px] ${
                pathname === item.path ? "text-blue-600 bg-neutral-50" : ""
              }`}
              onClick={() => setDropdownToggler(false)}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

