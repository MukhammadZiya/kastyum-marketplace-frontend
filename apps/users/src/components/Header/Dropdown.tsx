import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { MenuItem } from "../../types/menu";

type Props = {
  menuItem: MenuItem;
  stickyMenu?: boolean;
};

/**
 * Header-style dropdown for a `MenuItem` with `submenu`.
 * Not wired into the nav by default — import when you need it.
 */
export default function Dropdown({ menuItem, stickyMenu = false }: Props) {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const { pathname } = useLocation();

  const isActive = pathname.toLowerCase().includes(menuItem.title.toLowerCase());

  return (
    <li
      onClick={() => setDropdownToggler((v) => !v)}
      className={`group relative before:absolute before:left-0 before:top-0 before:h-[3px] before:w-0 before:rounded-b-[3px] before:bg-[#E11D48] before:duration-200 before:ease-out hover:before:w-full ${
        isActive ? "before:!w-full" : ""
      }`}
    >
      <button
        type="button"
        className={`flex items-center gap-[6px] text-[14px] font-medium capitalize text-neutral-900 hover:text-[#BE123C] ${
          stickyMenu ? "xl:py-4" : "xl:py-6"
        } ${isActive ? "!text-[#BE123C]" : ""}`}
      >
        {menuItem.title}
        <svg
          className="cursor-pointer fill-current"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
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
        }`}
      >
        {(menuItem.submenu ?? []).map((item) => (
          <li key={item.id}>
            <Link
              to={item.path}
              className={`flex px-[18px] py-[7px] text-[14px] hover:bg-[#FFF1F2] hover:text-[#BE123C] ${
                pathname === item.path ? "bg-[#FFF1F2] text-[#BE123C]" : ""
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
